'use server'

import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import { db, DB_renpyFileTable, renpyfilesTable, renpyTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from 'crypto'

export async function createSnippet(files: DB_renpyFileTable[], formData: FormData){
    const cookiesStore = await cookies();
    if (!cookiesStore.get("userId")){
      cookiesStore.set("userId", randomUUID().toString(), {maxAge: 999999999999999})
    }
    const new_entry = {
      title : formData.get("title")?.toString() || "",
      author : formData.get("author")?.toString(),
      catagory : formData.get("catagory")?.toString(),
      tags : formData.get("tags")?.toString(),
      description : formData.get("description")?.toString(),
      cookie_id : cookiesStore.get("userId")?.value
    }
    const new_id = (await db.insert(renpyTable).values(new_entry).returning({insertedId: renpyTable.id}))[0].insertedId
    const new_files = files.map((x) => ({code: x.code, filename: x.filename, snippet_id: new_id}));
    await db.insert(renpyfilesTable).values(new_files)
    redirect("/entry/" + new_id)
    
}

export async function editSnippet(files: DB_renpyFileTable[], formData: FormData){
  //1. We need the ID to do a edit on. Hidden value
  //Info data part is easy, grab values from fourm then update with the correct ID
  //2. 3 types of files. Premade that we edit, new files, premade that we remove.
  //This is a bit harder. We can do this by id/snippet_id. If id != -1, its an edited premade so update
  //If the id is -1, then its a new file, so insert
  //If the id is not -1, but the snippet id is, we delete the file
  const new_entry = {
    title : formData.get("title")?.toString() || "",
    author : formData.get("author")?.toString(),
    catagory : formData.get("catagory")?.toString(),
    tags : formData.get("tags")?.toString(),
    description : formData.get("description")?.toString(),
    
  }
  const id = Number.parseInt(formData.get("id")?.toString() || "-1")
  if (id == -1){
    //TODO: Throw error here if ID is not parsed correctly. No idea how yet
    //TODO: When do the error throwing here, we need to also throw if the user is trying to edit a cookie thats not thiers. Right now we are just going for hide buttons
  }
  await db.update(renpyTable).set(new_entry).where(eq(renpyTable.id, id))
  for (const file of files){
    if (file.id == -1){ //New file, not in db yet
      const insert_object = {code: file.code, filename: file.filename, snippet_id: id} //Create file structure
      await db.insert(renpyfilesTable).values(insert_object)
    }
    else if(file.snippet_id == -1){//Delete file, file is in db, but needs to be removed
      await db.delete(renpyfilesTable).where(eq(renpyfilesTable.id, file.id))
    }
    else {//Old file, in db, just update
      await db.update(renpyfilesTable).set(file).where(eq(renpyfilesTable.id, file.id))
    }
  }
  redirect("/entry/" + id)
}

export async function deleteSnippet(formData: FormData){
  const searchTerm = formData.get("searchFilter");
  const id = Number.parseInt(formData.get("id")?.toString() || "-1")
  await db.delete(renpyfilesTable).where(eq(renpyfilesTable.snippet_id, id))
  await db.delete(renpyTable).where(eq(renpyTable.id, id))
  redirect("/browse" + (searchTerm ? "?searchTerm=" + searchTerm : "" ))
}