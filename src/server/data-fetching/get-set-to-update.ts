import { auth } from "@clerk/nextjs/server";
import { db } from "../db";
import { notFound } from "next/navigation";

export async function getSetToUpdate(slug: string) {
  const user = await auth.protect();

  const set = await db.query.set.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
    },
    with: {
      cards: {
        columns: {
          id: true,
          term: true,
          termKey: true,
          termUrl: true,
          definition: true,
          definitionKey: true,
          definitionUrl: true,
        },
      },
    },
    where: (set, { eq, and }) =>
      and(eq(set.userId, user.userId), eq(set.id, slug)),
  });

  if (!set) return notFound();

  return {
    id: set.id,
    name: set.name,
    description: set.description ?? "",
    cards: set.cards.map((card) => ({
      id: card.id,
      term: card.term,
      termKey: card.termKey ?? "",
      termUrl: card.termUrl ?? "",
      definition: card.definition ?? "",
      definitionKey: card.definitionKey ?? "",
      definitionUrl: card.definitionUrl ?? "",
    })),
  };
}
