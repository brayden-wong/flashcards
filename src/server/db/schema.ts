// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  serial,
  pgTableCreator,
  timestamp,
  varchar,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

/**

This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
database instance for multiple projects.*
@see https://orm.drizzle.team/docs/goodies#multi-project-schema*/
export const createTable = pgTableCreator((name) => `flashcards_${name}`);

export const colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "orange",
  "pink",
  "black",
  "white",
] as const;

export const color_picker = pgEnum("color_picker", colors);

export const card = createTable("card", {
  id: serial("id").primaryKey(),
  setId: varchar("set_id")
    .notNull()
    .references(() => set.id, { onDelete: "cascade" }),
  term: varchar("term").notNull(),
  termUrl: varchar("term_url"),
  termKey: varchar("term_key"),
  definition: varchar("definition"),
  definitionUrl: varchar("definition_url"),
  definitionKey: varchar("definition_key"),
});

export const set = createTable("set", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: varchar("user_id").notNull(),
  folderId: varchar("folder_id").references(() => folder.id),
  name: varchar("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const folder = createTable("folder", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  color: color_picker("color").notNull().default("blue"),
});

export const folderRelations = relations(folder, ({ many }) => ({
  sets: many(set),
}));

export const setRelations = relations(set, ({ one, many }) => ({
  cards: many(card),
  folder: one(folder, {
    fields: [set.folderId],
    references: [folder.id],
  }),
}));

export const cardRelations = relations(card, ({ one }) => ({
  set: one(set, {
    fields: [card.setId],
    references: [set.id],
  }),
}));
