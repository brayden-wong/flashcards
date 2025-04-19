import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db, schema } from "~/server/db";
import { deleteFiles } from "~/server/uploadthing";

const DeleteSetSchema = z.object({
  id: z.string(),
});

export async function DELETE(req: NextRequest) {
  const user = await auth.protect();

  const json = await req.json();

  const result = DeleteSetSchema.safeParse(json);

  if (!result.success)
    return NextResponse.json(
      { success: false, error: "Invalid payload" } as const,
      { status: 400 },
    );

  const { id } = result.data;

  const res = await db.transaction(async (tx) => {
    const set = await tx.query.set.findFirst({
      columns: {},
      with: {
        cards: { columns: { id: true, termKey: true, definitionKey: true } },
      },
      where: (set, { eq, and }) =>
        and(eq(set.id, id), eq(set.userId, user.userId)),
    });

    if (!set)
      return NextResponse.json(
        { success: false, error: "Set not found" } as const,
        { status: 404 },
      );

    const files = set.cards.reduce<string[]>((acc, cur) => {
      if (cur.termKey) acc.push(cur.termKey);
      if (cur.definitionKey) acc.push(cur.definitionKey);

      return acc;
    }, []);

    if (files.length > 0) {
      try {
        await deleteFiles(files);
      } catch (error) {
        console.error("Error deleting files:", error);

        return NextResponse.json(
          { success: false, error: "Failed to delete files" } as const,
          { status: 500 },
        );
      }
    }

    try {
      await tx
        .delete(schema.set)
        .where(and(eq(schema.set.id, id), eq(schema.set.userId, user.userId)));
    } catch (error) {
      console.error("Error deleting set:", error);

      return NextResponse.json(
        { success: false, error: "Failed to delete set" } as const,
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: "Set deleted" } as const, {
      status: 200,
    });
  });

  res.cookies.set("update", "", { expires: Date.now() });

  return res;
}

export type DeleteSetRoute =
  Awaited<ReturnType<typeof DELETE>> extends NextResponse<infer T> ? T : never;
