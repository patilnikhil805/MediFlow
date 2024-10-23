import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import departments from "@/features/departments/server/route"

const app = new Hono().basePath('/api')

const routes = app
    .route("/auth", auth)
    // .route("/users", users)
    .route('/departments', departments)


export const GET = handle(app)
export const POST = handle(app)

export type AppType = typeof routes;