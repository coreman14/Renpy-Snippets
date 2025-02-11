import 'dotenv/config';
import { relations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { int, sqliteTable, text,  } from 'drizzle-orm/sqlite-core';
export const db = drizzle(process.env.DB_FILE_NAME!);

export interface renpyTableCreateForm {
    title : string,
    author : string | undefined,
    catagory : string | undefined,
    tags : string | undefined,
    description : string | undefined,
    // cookieId : "281d5ef6-b2da-4a10-90fb-971eb4e35d32", //Tracks who made the file without being logged in
    //We ignore this for now
}
export const renpyTable = sqliteTable("renpy_snippet", {
    id: int().primaryKey({autoIncrement: true}),
    title: text().notNull(),
    author: text(),
    catagory: text(),
    tags: text(),
    description: text(),
    cookie_id: text(),
    cdate: int().notNull().$defaultFn(() => new Date().getTime()),
    mdate: int().notNull().$defaultFn(() => new Date().getTime()).$onUpdateFn(() => new Date().getTime())

})
export const renpyTableFileRelations = relations(renpyTable, ({ many}) => ({
    files: many(renpyfilesTable)
})
)
export type DB_renpyTable = typeof renpyTable.$inferSelect;

export const renpyfilesTable = sqliteTable("renpy_snippet_files", {
    id: int().primaryKey({autoIncrement: true}),
    snippet_id: int(), //Forgien key to RenpyTable
    filename: text().notNull(),
    code: text().notNull(),
    cdate: int().notNull().$defaultFn(() => new Date().getTime()),
    mdate: int().notNull().$defaultFn(() => new Date().getTime()).$onUpdateFn(() => new Date().getTime())
})

export const renpyFileTableRelations = relations(renpyfilesTable, ({one}) => ({
    snippet_id: one(renpyTable, {
        fields: [renpyfilesTable.snippet_id],
        references: [ renpyTable.id]
    })
}))
export type DB_renpyFileTable = typeof renpyfilesTable.$inferSelect;

export const renpyFileDefaultNewFile: DB_renpyFileTable = {filename: "", code: "label default_label:\n    john 'It's the start of somethign new'", mdate: 0, cdate: 0, snippet_id: 0, id: -1}