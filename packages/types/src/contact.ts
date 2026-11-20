export interface ContactSubmissionPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  botField?: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  details?: Record<string, string[]>;
}
