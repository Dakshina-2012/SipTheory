import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createContactSubmission, createReservation } from "./db";

const reservationInput = z.object({
  name: z.string().min(2).max(160),
  email: z.string().email().max(320),
  phone: z.string().min(9).max(40),
  date: z.string().min(8).max(12),
  time: z.string().min(4).max(8),
  guests: z.number().int().min(1).max(12),
  request: z.string().max(1000).optional().default(""),
});

const contactInput = z.object({
  name: z.string().min(2).max(160),
  email: z.string().email().max(320),
  subject: z.string().max(200).optional().default(""),
  message: z.string().min(2).max(3000),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  reservations: router({
    create: publicProcedure.input(reservationInput).mutation(async ({ input }) => {
      await createReservation(input);
      return { success: true } as const;
    }),
  }),
  contact: router({
    create: publicProcedure.input(contactInput).mutation(async ({ input }) => {
      await createContactSubmission(input);
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
