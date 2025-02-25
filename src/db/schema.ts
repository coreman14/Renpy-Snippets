import "dotenv/config";
import { or, relations, like, SQL, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const db = drizzle(process.env.DB_FILE_NAME!);

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
export type browseAdvancedSearchResult = Record<
    number,
    {
        snippet: DB_renpyTable;
        files: DB_renpyFileTable[];
    }
>;
export type browseAdvancedSearchSingle = {
    snippet: DB_renpyTable;
    files: DB_renpyFileTable[];
};

export const browseSimpleSearch = async function (filterString: string, orderBy: SQL | null = null) {
    if (!orderBy) {
        orderBy = desc(renpyTable.mdate);
    }
    filterString = `%${filterString}%`;
    return await db
        .select()
        .from(renpyTable)
        .where(
            or(
                like(renpyTable.title, filterString),
                like(renpyTable.author, filterString),
                like(renpyTable.tags, filterString),
                like(renpyTable.description, filterString),
                like(renpyTable.catagory, filterString)
            )
        )
        .orderBy(orderBy);
};

export const browseAdvancedSearch = async function (filterString: string, orderBy: SQL | null = null) {
    if (!orderBy) {
        orderBy = desc(renpyTable.mdate);
    }
    filterString = `%${filterString}%`;
    const rows = await db
        .select({
            snippet: renpyTable,
            files: renpyfilesTable,
        })
        .from(renpyTable)
        .leftJoin(renpyfilesTable, eq(renpyTable.id, renpyfilesTable.snippet_id))
        .where(
            or(
                like(renpyTable.title, filterString),
                like(renpyTable.author, filterString),
                like(renpyTable.tags, filterString),
                like(renpyTable.description, filterString),
                like(renpyTable.catagory, filterString)
            )
        )
        .orderBy(orderBy)
        .all();
    const id_order = new Set(rows.map((x) => x.snippet.id));
    const resultArray: browseAdvancedSearchSingle[] = [];
    const result = rows.reduce<browseAdvancedSearchResult>((acc, row) => {
        const snippet = row.snippet;
        const files = row.files;
        if (!acc[snippet.id]) {
            acc[snippet.id] = { snippet, files: [] };
        }
        if (files) {
            acc[snippet.id].files.push(files);
        }
        return acc;
    }, {});
    id_order.forEach((x) => resultArray.push(result[x]));
    return resultArray;
};
export const authorAdvancedSearch = async function (author: string, orderBy: SQL | null = null) {
    if (!orderBy) {
        orderBy = desc(renpyTable.mdate);
    }

    const rows = await db
        .select({
            snippet: renpyTable,
            files: renpyfilesTable,
        })
        .from(renpyTable)
        .leftJoin(renpyfilesTable, eq(renpyTable.id, renpyfilesTable.snippet_id))
        .where(sql`lower(${renpyTable.author}) = ${author.toLowerCase()}`)
        .orderBy(orderBy)
        .all();
    const id_order = new Set(rows.map((x) => x.snippet.id));
    const resultArray: browseAdvancedSearchSingle[] = [];
    const result = rows.reduce<browseAdvancedSearchResult>((acc, row) => {
        const snippet = row.snippet;
        const files = row.files;
        if (!acc[snippet.id]) {
            acc[snippet.id] = { snippet, files: [] };
        }
        if (files) {
            acc[snippet.id].files.push(files);
        }
        return acc;
    }, {});
    id_order.forEach((x) => resultArray.push(result[x]));
    return resultArray;
};
export const catagoryAdvancedSearch = async function (catagory: string, orderBy: SQL | null = null) {
    if (!orderBy) {
        orderBy = desc(renpyTable.mdate);
    }

    const rows = await db
        .select({
            snippet: renpyTable,
            files: renpyfilesTable,
        })
        .from(renpyTable)
        .leftJoin(renpyfilesTable, eq(renpyTable.id, renpyfilesTable.snippet_id))
        .where(sql`lower(${renpyTable.catagory}) = ${catagory.toLowerCase()}`)
        .orderBy(orderBy)
        .all();
    const id_order = new Set(rows.map((x) => x.snippet.id));
    const resultArray: browseAdvancedSearchSingle[] = [];
    const result = rows.reduce<browseAdvancedSearchResult>((acc, row) => {
        const snippet = row.snippet;
        const files = row.files;
        if (!acc[snippet.id]) {
            acc[snippet.id] = { snippet, files: [] };
        }
        if (files) {
            acc[snippet.id].files.push(files);
        }
        return acc;
    }, {});
    id_order.forEach((x) => resultArray.push(result[x]));
    return resultArray;
};
