import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import departments from "@/features/departments/server/route"
import staff from '@/features/staff/server/route'

const app = new Hono().basePath('/api')

const routes = app
    .route("/auth", auth)
    .route("/staff", staff)
    .route('/departments', departments)


export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app);

export type AppType = typeof routes;