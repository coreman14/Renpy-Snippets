import { db, renpyfilesTable, renpyTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import JSZip from "jszip";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    //Find the snippet to download
    const snippetId = parseInt((await params).id || "-1");
    if (snippetId < 0 || isNaN(snippetId)) {
        return new Response("Snippet ID was not value. Given id: " + (await params).id, {status: 404})
    }
    //Retrive the files from the DB
    const snippet = (await db.select().from(renpyTable).where(eq(renpyTable.id, snippetId)).all())[0];
    if (!snippet){
        return new Response("Could not find snippet with id of " + snippetId, {status: 404})
    }
    snippet.tags = snippet.catagory + (snippet.tags ? "," + snippet.tags : "");
    const files = await db.select().from(renpyfilesTable).where(eq(renpyfilesTable.snippet_id, snippetId)).all();
    //Create zip file response
    const zip = new JSZip();
    //Create scenario in jszip
    const scenarioYmlData = `author: ${snippet.author || "Anonymous"}
description: ${snippet.description || "null"}
title: ${snippet.title}
tags:
- ${snippet.tags.split(",").join("\n- ")}
banner: null
label: null
prefix: null
tfgs_thread: null
version: 0.0.1
`
    zip.file(
        "scenario.yml",
        scenarioYmlData
    );
    for (const file of files) {
        zip.file(`story/${file.filename}`, file.code);
    }

    // set the headers to tell the browser to download the file
    const headers = new Headers();
    // remember to change the filename `test.pdf` to whatever you want the downloaded file called
    headers.append("Content-Disposition", 'attachment; filename="' + snippet.title.replaceAll(/\s+/g, "_") + '.zip"');
    headers.append("Content-Type", "application/zip");

    return new Response(await (zip.generateAsync({ type: "blob" })), {
      headers,
    });

}
