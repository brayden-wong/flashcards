import { auth } from "@clerk/nextjs/server";
import { and, eq, notInArray, sql } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db, schema } from "~/server/db";

const CardSchema = z.object({
  id: z.number(),
  term: z.string().min(1, { message: "Term is required" }),
  termUrl: z.string().optional(),
  termKey: z.string().optional(),
  definition: z.string().min(1, { message: "Definition is required" }),
  definitionUrl: z.string().optional(),
  definitionKey: z.string().optional(),
});

const UpdateSetSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  cards: z
    .array(CardSchema)
    .min(1, { message: "At least one card is required" }),
});

export async function POST(req: NextRequest) {
  try {
    const user = await auth.protect();

    const json = await req.json();

    const result = UpdateSetSchema.safeParse(json);

    if (!result.success)
      return NextResponse.json(
        { success: false, error: "Invalid data" } as const,
        { status: 400 },
      );

    const set = {
      id: result.data.id,
      name: result.data.name,
      description: result.data.description,
    };

    const cards = result.data.cards.map((card) => ({
      id: card.id === -1 ? undefined : card.id,
      term: card.term,
      setId: result.data.id,
      termKey: card.termKey,
      termUrl: card.termUrl,
      definition: card.definition,
      definitionKey: card.definitionKey,
      definitionUrl: card.definitionUrl,
    }));

    const submittedCards = result.data.cards
      .map((card) => card.id)
      .filter((card): card is number => card !== -1);

    await db.transaction(async (tx) => {
      await tx
        .update(schema.set)
        .set(set)
        .where(
          and(
            eq(schema.set.id, result.data.id),
            eq(schema.set.userId, user.userId),
          ),
        );

      if (submittedCards.length > 0)
        await tx
          .delete(schema.card)
          .where(
            and(
              eq(schema.card.setId, result.data.id),
              notInArray(schema.card.id, submittedCards),
            ),
          );
      else
        await tx
          .delete(schema.card)
          .where(eq(schema.card.setId, result.data.id));

      if (cards.length > 0)
        await tx
          .insert(schema.card)
          .values(cards)
          .onConflictDoUpdate({
            target: schema.card.id,
            set: {
              term: sql`excluded.term`,
              termUrl: sql`excluded.term_url`,
              termKey: sql`excluded.term_key`,
              definition: sql`excluded.definition`,
              definitionUrl: sql`excluded.definition_url`,
              definitionKey: sql`excluded.definition_key`,
            },
          });
    });

    const res = NextResponse.json(
      { success: true, data: "Set updated" } as const,
      { status: 200 },
    );

    res.cookies.set("update", "", { expires: Date.now() });

    return res;
  } catch (error) {
    console.error("Set Update Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    if (errorMessage === "Set not found or permission denied.") {
      return NextResponse.json(
        { success: false, error: errorMessage } as const,
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update set" } as const,
      { status: 500 },
    );
  }
}

export type UpdateSetRoute =
  Awaited<ReturnType<typeof POST>> extends NextResponse<infer T> ? T : never;
