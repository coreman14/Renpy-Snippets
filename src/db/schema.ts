import "dotenv/config";
import { or, relations, like, desc, eq, sql, count, and, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const db = drizzle(
    process.env.AUTH_TOKEN!
        ? {
              //@ts-expect-error This works, and allows use to allow for both local and remote
              connection: {
                  url: process.env.DB_FILE_NAME!,
                  authToken: process.env.AUTH_TOKEN!,
              },
          }
        : process.env.DB_FILE_NAME!
);

export const vanityLink = sqliteTable("vanity_links", {
    id: int().primaryKey({ autoIncrement: true }),
    snippet_id: int().references(() => renpyTable.id).notNull(),
    url: text().notNull(),
})

export const renpyTable = sqliteTable("renpy_snippet", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    author: text(),
    catagory: text(),
    tags: text(),
    description: text(),
    cookie_id: text(),
    cdate: int()
        .notNull()
        .$defaultFn(() => new Date().getTime()),
    mdate: int()
        .notNull()
        .$defaultFn(() => new Date().getTime())
        .$onUpdateFn(() => new Date().getTime()),
});
export const renpyTableFileRelations = relations(renpyTable, ({ many }) => ({
    files: many(renpyfilesTable),
}));
export type DB_renpyTable = typeof renpyTable.$inferSelect;

export const renpyfilesTable = sqliteTable("renpy_snippet_files", {
    id: int().primaryKey({ autoIncrement: true }),
    snippet_id: int(), //Forgien key to RenpyTable
    filename: text().notNull(),
    code: text().notNull(),
    cdate: int()
        .notNull()
        .$defaultFn(() => new Date().getTime()),
    mdate: int()
        .notNull()
        .$defaultFn(() => new Date().getTime())
        .$onUpdateFn(() => new Date().getTime()),
});

export const renpyFileTableRelations = relations(renpyfilesTable, ({ one }) => ({
    snippet_id: one(renpyTable, {
        fields: [renpyfilesTable.snippet_id],
        references: [renpyTable.id],
    }),
}));
export type DB_renpyFileTable = typeof renpyfilesTable.$inferSelect;

export const renpyFileDefaultNewFile: DB_renpyFileTable = {
    filename: "",
    code: "label default_label:\n    john 'It's the start of something new'",
    mdate: 0,
    cdate: 0,
    snippet_id: 0,
    id: -1,
};

// result type
export type browseAdvancedSearchResult = Record<number, browseAdvancedSearchGrouped>;
export type browseAdvancedSearchGrouped = {
    snippet: DB_renpyTable;
    filenames: string[];
};
export type browseAdvancedSearchSingle = {
    snippet: DB_renpyTable;
    filename: string | null;
};

function getResultsAsArray(rows: browseAdvancedSearchSingle[]) {
    const id_order = new Set(rows.map((x) => x.snippet.id));
    const resultArray: browseAdvancedSearchGrouped[] = [];
    const result = rows.reduce<browseAdvancedSearchResult>((acc, row) => {
        const snippet = row.snippet;
        const filename = row.filename;
        if (!acc[snippet.id]) {
            acc[snippet.id] = { snippet, filenames: [] };
        }
        if (filename) {
            acc[snippet.id].filenames.push(filename);
        }
        return acc;
    }, {});
    id_order.forEach((x) => resultArray.push(result[x]));
    return resultArray;
}

export const numberOfSnippets = async () => {
    return await db.select({ value: count() }).from(renpyTable);
};

export const homePageResults = async function () {
    //Do pagination on the Id's themselves, not the table join
    const ids = await db.select({ id: renpyTable.id }).from(renpyTable).orderBy(desc(renpyTable.cdate)).limit(6);
    const rows = await db
        .select({
            snippet: renpyTable,
            filename: renpyfilesTable.filename,
        })
        .from(renpyTable)
        .leftJoin(renpyfilesTable, eq(renpyTable.id, renpyfilesTable.snippet_id))
        .where(
            inArray(
                renpyTable.id,
                ids.map((x) => x.id)
            )
        )
        .orderBy(desc(renpyTable.cdate));
    return getResultsAsArray(rows);
};

export const browseCodeSearch = async function (filterString: string) {
    filterString = `%${filterString}%`;
    const ids = await db
        .select({ id: renpyfilesTable.snippet_id })
        .from(renpyfilesTable)
        .where(
            or(
                like(renpyfilesTable.filename, filterString),
                like(renpyfilesTable.code, filterString),

            )
        );
    const rows = await db
        .select({
            snippet: renpyTable,
            filename: renpyfilesTable.filename,
        })
        .from(renpyTable)
        .leftJoin(renpyfilesTable, eq(renpyTable.id, renpyfilesTable.snippet_id))
        .where(
            and(
                inArray(
                    renpyTable.id,
                    ids.map((x) => x.id || -1)
                )
            )
        )
        .all();
    return getResultsAsArray(rows);
};
export const browseSimpleSearch = async function (filterString: string) {
    filterString = `%${filterString}%`;
    const ids = await db
        .select({ id: renpyTable.id })
        .from(renpyTable)
        .where(
            or(
                like(renpyTable.title, filterString),
                like(renpyTable.author, filterString),
                like(renpyTable.tags, filterString),
                like(renpyTable.description, filterString),
                like(renpyTable.catagory, filterString)
            )
        );
    const rows = await db
        .select({
            snippet: renpyTable,
            filename: renpyfilesTable.filename,
        })
        .from(renpyTable)
        .leftJoin(renpyfilesTable, eq(renpyTable.id, renpyfilesTable.snippet_id))
        .where(
            and(
                inArray(
                    renpyTable.id,
                    ids.map((x) => x.id)
                )
            )
        )
        .all();
    return getResultsAsArray(rows);
};
export const authorAdvancedSearch = async function (author: string) {
    const ids = await db
        .select({ id: renpyTable.id })
        .from(renpyTable)
        .where(sql`lower(${renpyTable.author}) = ${author.toLowerCase()}`);
    const rows = await db
        .select({
            snippet: renpyTable,
            filename: renpyfilesTable.filename,
        })
        .from(renpyTable)
        .leftJoin(renpyfilesTable, eq(renpyTable.id, renpyfilesTable.snippet_id))
        .where(
            inArray(
                renpyTable.id,
                ids.map((x) => x.id)
            )
        )
        .all();
    return getResultsAsArray(rows);
};
export const catagoryAdvancedSearch = async function (catagory: string) {
    //Do pagination on the Id's themselves, not the table join
    const ids = await db
        .select({ id: renpyTable.id })
        .from(renpyTable)
        .where(sql`lower(${renpyTable.catagory}) = ${catagory.toLowerCase()}`);
    const rows = await db
        .select({
            snippet: renpyTable,
            filename: renpyfilesTable.filename,
        })
        .from(renpyTable)
        .leftJoin(renpyfilesTable, eq(renpyTable.id, renpyfilesTable.snippet_id))
        .where(
            inArray(
                renpyTable.id,
                ids.map((x) => x.id)
            )
        )
        .all();
    return getResultsAsArray(rows);
};
export const tagAdvancedSearch = async function (tag: string) {
    tag = `%${tag.toLowerCase()}%`;
    //Do pagination on the Id's themselves, not the table join
    const ids = await db
        .select({ id: renpyTable.id })
        .from(renpyTable)
        .where(sql`lower(${renpyTable.tags}) like ${tag}`);
    const rows = await db
        .select({
            snippet: renpyTable,
            filename: renpyfilesTable.filename,
        })
        .from(renpyTable)
        .leftJoin(renpyfilesTable, eq(renpyTable.id, renpyfilesTable.snippet_id))
        .where(
            inArray(
                renpyTable.id,
                ids.map((x) => x.id)
            )
        )
        .all();
    return getResultsAsArray(rows);
};
