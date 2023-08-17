// types/next-auth.d.ts

import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      creatorId?: string | null; // Add your new property here
    } & DefaultSession["user"]; // Preserve other properties from DefaultSession
  }
}
