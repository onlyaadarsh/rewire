import { z } from "zod";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "../init";
import {
  CreateJournalEntrySchema,
  ReframeJournalEntrySchema,
  UpdatePostOffloadSchema,
} from "@rewire/validation";
import { reframeBrainDump } from "@/lib/reframing-service";
import { syncJournalEntryToGraph } from "@/lib/insights-service";

export const journalRouter = createTRPCRouter({

  /**
   * Run cognitive reframing & mental offload analysis on raw brain dump text.
   * Strictly requires an authenticated user session.
   */
  reframe: protectedProcedure
    .input(ReframeJournalEntrySchema)
    .mutation(async ({ ctx, input }) => {
      const analysis = await reframeBrainDump(
        input.rawContent,
        input.moodBefore,
        ctx.user.id,
        input.distressTags,
      );
      return analysis;
    }),

  /**
   * Save a brain dump session into the user's personal journal.
   */
  create: protectedProcedure
    .input(CreateJournalEntrySchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const entry = await ctx.db.journalEntry.create({
        data: {
          userId,
          title: input.title || `Brain Dump: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          rawContent: input.rawContent,
          moodBefore: input.moodBefore ?? null,
          distressTags: input.distressTags,
        },
      });

      return entry;
    }),

  /**
   * Update entry post-offload with moodAfter, actionTaken, and reframingResult.
   */
  updateAfter: protectedProcedure
    .input(UpdatePostOffloadSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Ensure ownership
      const existing = await ctx.db.journalEntry.findUnique({
        where: { id: input.id },
      });

      if (!existing || existing.userId !== userId) {
        throw new Error("Journal entry not found or unauthorized");
      }

      const updated = await ctx.db.journalEntry.update({
        where: { id: input.id },
        data: {
          moodAfter: input.moodAfter ?? undefined,
          actionTaken: input.actionTaken ?? undefined,
          reframingResult: input.reframingResult ?? undefined,
        },
      });

      // Asynchronously sync to Neo4j graph in background
      const reframingData = (input.reframingResult || existing.reframingResult) as any;
      const distortions = reframingData?.distortions?.map((d: any) => ({
        name: d.name,
        detectedThought: d.detectedThought,
      })) || [];
      const strategyUsed =
        reframingData?.microAction ? "Two-Minute Behavioral Micro-Action" :
        (reframingData?.circleOfControl ? "Circle of Control Delineation" : "Cognitive Restructuring");

      syncJournalEntryToGraph({
        userId,
        entryId: updated.id,
        moodBefore: updated.moodBefore,
        moodAfter: updated.moodAfter,
        distressTags: updated.distressTags || [],
        actionTaken: updated.actionTaken,
        distortions,
        strategyUsed,
        createdAt: updated.createdAt,
      }).catch((err) => {
        console.warn("[journal.ts] Background sync to graph failed:", err);
      });

      return updated;
    }),


  /**
   * List user's journal entries in reverse chronological order.
   */
  list: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }).optional())
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const limit = input?.limit ?? 20;

      const entries = await ctx.db.journalEntry.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return entries.map((entry) => ({
        id: entry.id,
        userId: entry.userId,
        title: entry.title,
        rawContent: entry.rawContent,
        moodBefore: entry.moodBefore,
        moodAfter: entry.moodAfter,
        distressTags: entry.distressTags,
        actionTaken: entry.actionTaken,
        reframingResult: entry.reframingResult as unknown as Record<string, unknown> | null,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      }));
    }),

  /**
   * Get single entry by ID.
   */
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const entry = await ctx.db.journalEntry.findUnique({
        where: { id: input.id },
      });

      if (!entry || entry.userId !== userId) {
        throw new Error("Not found");
      }

      return {
        ...entry,
        reframingResult: entry.reframingResult as unknown as Record<string, unknown> | null,
      };
    }),

  /**
   * Delete an entry.
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const existing = await ctx.db.journalEntry.findUnique({
        where: { id: input.id },
      });

      if (!existing || existing.userId !== userId) {
        throw new Error("Not found");
      }

      await ctx.db.journalEntry.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
