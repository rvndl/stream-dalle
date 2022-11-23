import { router } from "../trpc";
import { authRouter } from "./auth";
import { galleryRouter } from "./gallery";

export const appRouter = router({
  auth: authRouter,
  gallery: galleryRouter,
});

export type AppRouter = typeof appRouter;
