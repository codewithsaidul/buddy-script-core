import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { EventsRoutes } from "../modules/events/events.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { SeatRoutes } from "../modules/seat/seat.route";
import { UserRoutes } from "../modules/user/user.route";
import { StatsRoutes } from "../modules/stats/stats.route";
import { AdminRoutes } from "../modules/admin/admin.route";

export const router = Router();

const modulesRoute = [];

modulesRoute.forEach((route) => {
  router.use(route.path, route.route);
});
