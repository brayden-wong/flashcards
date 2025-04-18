import type { colors } from "~/server/db/schema";

export type Color = (typeof colors)[number];
