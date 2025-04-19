"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Color } from "~/lib/types/color";
import { db, schema } from "./db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

type Props = {
  id: string;
  color: Color;
};

export async function changeColor({ id, color }: Props) {
  const user = await auth.protect();

  if (!user) redirect("/");

  await db.update(schema.folder).set({ color }).where(eq(schema.folder.id, id));

  const jar = await cookies();

  jar.set("update", "", { expires: Date.now() });
}
