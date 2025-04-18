import { z } from "zod";
import { type NextRequest, NextResponse } from "next/server";
import { db, schema } from "~/server/db";
import { auth } from "@clerk/nextjs/server";

const CardSchema = z.object({
  term: z.string().min(1, { message: "Term is required" }),
  termUrl: z.string().optional(),
  termKey: z.string().optional(),
  definition: z.string().min(1, { message: "Definition is required" }),
  definitionUrl: z.string().optional(),
  definitionKey: z.string().optional(),
});

const SetFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  cards: z
    .array(CardSchema)
    .min(1, { message: "At least one card is required" }),
});

export type SetFormSchema = z.infer<typeof SetFormSchema>;

export async function POST(req: NextRequest) {
  await auth.protect();

  const json: z.infer<typeof SetFormSchema> = await req.json();

  const data = SetFormSchema.safeParse(json);

  if (!data.success)
    return NextResponse.json({ success: false, error: data.error } as const, {
      status: 400,
    });

  const result = SetFormSchema.safeParse(data);

  if (!result.success)
    return NextResponse.json({ success: false, error: result.error } as const, {
      status: 400,
    });

  const user = await auth();

  if (!user.userId)
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 400 },
    );

  const [set] = await db
    .insert(schema.set)
    .values({
      userId: user.userId,
      name: result.data.name,
      description: result.data.description,
    })
    .returning({ id: schema.set.id });

  if (!set)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create set",
      } as const,
      { status: 500 },
    );

  await db.insert(schema.card).values(
    result.data.cards.map((card) => ({
      ...card,
      setId: set.id,
    })),
  );

  const res = NextResponse.json(
    { success: true, data: "Set created" } as const,
    {
      status: 201,
    },
  );

  res.cookies.set("update", "", { expires: Date.now() });

  return res;
}

export type CreateSetRoute =
  Awaited<ReturnType<typeof POST>> extends NextResponse<infer T> ? T : never;
