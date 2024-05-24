import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";

export function initDB(url: string, token: string) {
  const turso = createClient({
    url: url,
    authToken: token,
  });
  return drizzle(turso);
}
