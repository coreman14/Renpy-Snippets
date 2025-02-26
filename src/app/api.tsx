"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, DB_renpyFileTable, renpyfilesTable, renpyTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

/*
For button testing
  const start = new Date().getTime();
  while ((new Date().getTime() - start) < 9000) {}

*/

export async function createSnippet(files: DB_renpyFileTable[], formData: FormData) {
    const cookiesStore = await cookies();
    if (!cookiesStore.get("userId")) {
        cookiesStore.set("userId", randomUUID().toString(), { maxAge: 999999999999999 });
    } else {
        const value = cookiesStore.get("userId")?.value || randomUUID().toString();
        cookiesStore.set("userId", value, { maxAge: 999999999999999 });
    }
    const new_entry = {
        title: formData.get("title")?.toString() || "",
        author: formData.get("author")?.toString(),
        catagory: formData.get("catagory")?.toString(),
        tags: formData.get("tags")?.toString(),
        description: formData.get("description")?.toString(),
        cookie_id: cookiesStore.get("userId")?.value,
    };
    const new_id = (await db.insert(renpyTable).values(new_entry).returning({ insertedId: renpyTable.id }))[0]
        .insertedId;
    const new_files = files.map((x) => ({ code: x.code, filename: x.filename, snippet_id: new_id }));
    await db.insert(renpyfilesTable).values(new_files);
    redirect("/entry/" + new_id);
}

export async function editSnippet(files: DB_renpyFileTable[], formData: FormData) {
    const cookiesStore = await cookies();
    if (!cookiesStore.get("userId")) {
        cookiesStore.set("userId", randomUUID().toString(), { maxAge: 999999999999999 });
    } else {
        const value = cookiesStore.get("userId")?.value || randomUUID().toString();
        cookiesStore.set("userId", value, { maxAge: 999999999999999 });
    }
    const new_entry = {
        title: formData.get("title")?.toString() || "",
        author: formData.get("author")?.toString(),
        catagory: formData.get("catagory")?.toString(),
        tags: formData.get("tags")?.toString(),
        description: formData.get("description")?.toString(),
    };
    const id = Number.parseInt(formData.get("id")?.toString() || "-1");
    if (id == -1) {
        //TODO: Throw error here if ID is not parsed correctly. No idea how yet
        //TODO: When do the error throwing here, we need to also throw if the user is trying to edit a cookie thats not thiers. Right now we are just going for hide buttons
    }
    await db.update(renpyTable).set(new_entry).where(eq(renpyTable.id, id));
    for (const file of files) {
        if (file.id == -1) {
            //New file, not in db yet
            const insert_object = { code: file.code, filename: file.filename, snippet_id: id }; //Create file structure
            await db.insert(renpyfilesTable).values(insert_object);
        } else if (file.snippet_id == -1) {
            //Delete file, file is in db, but needs to be removed
            await db.delete(renpyfilesTable).where(eq(renpyfilesTable.id, file.id));
        } else {
            //Old file, in db, just update
            await db.update(renpyfilesTable).set(file).where(eq(renpyfilesTable.id, file.id));
        }
    }
    redirect("/entry/" + id);
}

export async function deleteSnippet(formData: FormData) {
    const cookiesStore = await cookies();
    if (!cookiesStore.get("userId")) {
        cookiesStore.set("userId", randomUUID().toString(), { maxAge: 999999999999999 });
    } else {
        const value = cookiesStore.get("userId")?.value || randomUUID().toString();
        cookiesStore.set("userId", value, { maxAge: 999999999999999 });
    }
    const searchTerm = formData.get("searchFilter");
    const id = Number.parseInt(formData.get("id")?.toString() || "-1");
    await db.delete(renpyfilesTable).where(eq(renpyfilesTable.snippet_id, id));
    await db.delete(renpyTable).where(eq(renpyTable.id, id));
    const redirectPlace = formData.get("currentPage")?.toString();
    const redirectEnd = "?" + (searchTerm ? "searchTerm=" + searchTerm : "");
    if (redirectPlace == "browse") {
        redirect("/browse" + redirectEnd);
    } else {
        redirect("/" + redirectEnd);
    }
}

