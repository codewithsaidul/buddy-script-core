import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { PostRoutes } from "../modules/post/post.route";


export const router = Router();

const modulesRoute = [
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/users",
    route: UserRoutes
  },
  {
    path: "/posts",
    route: PostRoutes
  },
];

modulesRoute.forEach((route) => {
  router.use(route.path, route.route);
});
