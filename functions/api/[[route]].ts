import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { z } from "zod";
import { initDB } from "../../drizzle/db";
import { user } from "../../drizzle/schema";

type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.use("*", async (c, next) => {
  const db = initDB(c.env.DATABASE_URL, c.env.DATABASE_AUTH_TOKEN);
  const result = await db.select().from(user).all();
  console.log(result);
  await next();
});

const route = app.get(
  "/hello",
  zValidator(
    "query",
    z.object({
      name: z.string(),
    }),
  ),
  (c) => {
    const { name } = c.req.valid("query");
    console.log(c.env);
    return c.json({
      message: `Hello ${name}!`,
    });
  },
);

export type AppType = typeof route;

export const onRequest = handle(app);
