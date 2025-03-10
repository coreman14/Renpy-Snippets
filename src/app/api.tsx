"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, DB_renpyFileTable, isVanityLinkFree, renpyfilesTable, renpyTable, vanityLink } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { formatVanityURLPath } from "./utils/formValidation";

/*
For button testing
  const start = new Date().getTime();
  while ((new Date().getTime() - start) < 9000) {}

*/

export type actionState = {
    message: string,
    title?: string,
    author?: string,
    catagory?: string,
    tags?: string,
    description?: string,
  }

export async function createSnippet(prevState: actionState, formData: FormData) {
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
    let encoding_link = "";
    if (formData.get('vanity')){
        encoding_link = formData.get('vanity')?.toString() || ""
        encoding_link = formatVanityURLPath(encoding_link)
        const linkAlreadyExists = await isVanityLinkFree(encoding_link)
        if (!linkAlreadyExists){
            return {message: "Vanity Link is used. Please choose a different link",
                    title: new_entry.title,
                    author: new_entry.author,
                    catagory: new_entry.catagory,
                    tags: new_entry.tags,
                    description: new_entry.description,
            }
        }
    }
    const new_id = (await db.insert(renpyTable).values(new_entry).returning({ insertedId: renpyTable.id }))[0]
    .insertedId;
    if (formData.get('vanity')){
        await db.insert(vanityLink).values({snippet_id: new_id, url: encoding_link }).onConflictDoUpdate({target: vanityLink.snippet_id, set: {url: encoding_link}})
    }
    const files: DB_renpyFileTable[] = JSON.parse(formData.get('files')?.toString() || "")
    const new_files = files.map((x) => ({ code: x.code, filename: x.filename, snippet_id: new_id }));
    await db.insert(renpyfilesTable).values(new_files);
    redirect("/snippet/" + new_id);
}

export async function editSnippet(prevState: actionState, formData: FormData) {
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
    let encoding_link = "";
    const id = Number.parseInt(formData.get("id")?.toString() || "-1");
    if (formData.get('vanity')){
        encoding_link = formData.get('vanity')?.toString() || ""
        encoding_link = formatVanityURLPath(encoding_link)

        const linkAlreadyExists = await isVanityLinkFree(encoding_link, id)
        if (!linkAlreadyExists){
            return {message: "Vanity Link is used. Please choose a different link"}
        }
    }
    if (id == -1) {
        //TODO: Throw error here if ID is not parsed correctly. No idea how yet
        //TODO: When do the error throwing here, we need to also throw if the user is trying to edit a cookie thats not thiers. Right now we are just going for hide buttons
    }
    await db.update(renpyTable).set(new_entry).where(eq(renpyTable.id, id));
    const files: DB_renpyFileTable[] = JSON.parse(formData.get('files')?.toString() || "")
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
    if (formData.get('vanity')){
        //Create vanity link (Run same function as we will on client)
        //Delete current vanity links, insert new links after.
        await db.insert(vanityLink).values({snippet_id: id, url: encoding_link }).onConflictDoUpdate({target: vanityLink.snippet_id, set: {url: encoding_link}})
    }
    redirect("/snippet/" + id);
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
    await db.delete(vanityLink).where(eq(vanityLink.snippet_id, id));
    await db.delete(renpyTable).where(eq(renpyTable.id, id));
    const redirectPlace = formData.get("currentPage")?.toString();
    const redirectEnd = "?" + (searchTerm ? "searchTerm=" + searchTerm : "");
    if (redirectPlace == "browse") {
        redirect("/browse" + redirectEnd);
    } else {
        redirect("/" + redirectEnd);
    }
}

