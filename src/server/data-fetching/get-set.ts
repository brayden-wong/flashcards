import { auth } from "@clerk/nextjs/server";
import { db } from "../db";

export async function getSet(id: string) {
  const user = await auth.protect();

  const set = await db.query.set.findFirst({
    with: { cards: true },
    columns: {
      id: true,
      name: true,
      description: true,
    },
    where: (set, { eq, and }) =>
      and(eq(set.id, id), eq(set.userId, user.userId)),
  });

  if (!set) return null;

  return set;
}
