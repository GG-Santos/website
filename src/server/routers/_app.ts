import { router } from "../trpc";
import { userRouter } from "./user";
import { postRouter } from "./post";
import { blogRouter } from "./blog";
import { roadmapRouter } from "./roadmap";
import { gameAssetRouter } from "./game-asset";
import { gameObjectiveRouter } from "./game-objective";
import { testimonialRouter } from "./testimonial";
import { siteSettingsRouter } from "./site-settings";
import { investorRouter } from "./investor";

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  blog: blogRouter,
  roadmap: roadmapRouter,
  gameAsset: gameAssetRouter,
  gameObjective: gameObjectiveRouter,
  testimonial: testimonialRouter,
  siteSettings: siteSettingsRouter,
  investor: investorRouter,
});

export type AppRouter = typeof appRouter;

