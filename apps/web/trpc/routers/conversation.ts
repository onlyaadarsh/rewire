import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { enqueueAiJob } from "@/lib/queue";
import { checkRateLimits } from "@/lib/rate-limiter";

export const conversationRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const conversations = await ctx.db.conversation.findMany({
      where: { userId: ctx.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
    return conversations;
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.conversation.findUnique({
        where: { id: input.id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
          aiRuns: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      });

      if (!conversation || conversation.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }

      return conversation;
    }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const conversation = await ctx.db.conversation.create({
      data: { userId: ctx.user.id },
    });
    return conversation;
  }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        role: z.literal("user").default("user"),
        content: z.string().min(1).max(10000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // 1. Enforce AI rate limiting atomically BEFORE touching PostgreSQL (Burst: 5 req/min, Quota: 30 req/hr)
      const rateLimitResult = await checkRateLimits([
        {
          key: `ratelimit:ai:burst:${userId}`,
          limit: 5,
          windowSeconds: 60,
        },
        {
          key: `ratelimit:ai:hourly:${userId}`,
          limit: 30,
          windowSeconds: 3600,
        },
      ]);

      if (!rateLimitResult.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `AI rate limit reached. Please wait ${rateLimitResult.retryAfter} seconds before sending another message.`,
        });
      }

      // 2. Verify conversation existence and ownership
      const conv = await ctx.db.conversation.findUnique({
        where: { id: input.conversationId },
        select: { userId: true },
      });

      if (!conv) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }

      if (conv.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Forbidden: You do not own this conversation",
        });
      }

      // 3. Save message to PostgreSQL
      const message = await ctx.db.conversationMessage.create({
        data: {
          conversationId: input.conversationId,
          role: "user",
          content: input.content,
        },
      });

      // 4. Initiate AI run and enqueue SQS job
      const aiRun = await ctx.db.aiRun.create({
        data: {
          conversationId: input.conversationId,
          triggeringMessageId: message.id,
          status: "queued",
        },
      });

      try {
        await enqueueAiJob({
          runId: aiRun.id,
          conversationId: input.conversationId,
          messageId: message.id,
          userId,
        });
      } catch (err: unknown) {
        console.error(
          `[tRPC sendMessage] Error enqueuing AI job for run ${aiRun.id}:`,
          err
        );
      }

      return {
        ...message,
        runId: aiRun.id,
      };
    }),
});
