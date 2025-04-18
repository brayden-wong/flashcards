import { currentUser } from "@clerk/nextjs/server";
import { db } from "../db";

export async function getSet(id: string) {
  const user = await currentUser();

  if (!user) return null;

  const set = await db.query.set.findFirst({
    with: { cards: true },
    columns: {
      id: true,
      name: true,
      description: true,
    },
    where: (set, { eq, and }) => and(eq(set.id, id), eq(set.userId, user.id)),
  });

  if (!set) return null;

  return set;
}
