import { currentUser } from "@clerk/nextjs/server";
import "server-only";
import { db } from "~/server/db";

export async function getSets() {
  const user = await currentUser();

  if (!user) return null;

  const data = await db.transaction(async (tx) => {
    const sets = await tx.query.set.findMany({
      columns: {
        id: true,
        name: true,
      },
      where: (set, { eq, and, sql }) =>
        and(eq(set.userId, user.id), sql`${set.folderId} is null`),
    });

    const folders = await tx.query.folder.findMany({
      where: (folder, { eq }) => eq(folder.userId, user.id),
      columns: {
        id: true,
        name: true,
        color: true,
      },
      with: {
        sets: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    return { sets, folders };
  });

  // const sets = await db.query.set.findMany({
  //   where: (set, { eq }) => eq(set.userId, user.id),
  //   with: { folder: true },
  //   orderBy: (set, { desc }) => [desc(set.createdAt)],
  // });

  return data;
}
