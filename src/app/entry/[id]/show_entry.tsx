'use client';

import CodePlace from "@/app/components/fileViewer";
import { renpyfilesTable, renpyTable } from "@/db/schema";
import Link from "next/link";
import { useState } from "react";


//TODO: Parsed date should be in a better format. Maybe May 05, 2025
//TODO: We should probably add a prop for "Newly created" just to give the user some feedback the snippet was uploaded
export default function BrowseView(props: {
    entry: (typeof renpyTable.$inferSelect)[];
    entry_files: (typeof renpyfilesTable.$inferSelect)[];
}){
    const entry = props.entry[0];
    const dateToUse = entry ? entry.cdate == entry.mdate ? entry.cdate : entry.mdate : ""
    const [dateobject] = useState(new Date(dateToUse));
    if (!entry){
      return <><h1 className="text-2xl text-[var(--layout-bar-selected)] pb-4 pt-2">Entry Not Found</h1>This snippet does not exist.<br/><Link href="/browse" className="text-[var(--forground-buttons)]">You can find existing snippets here.</Link></>
    }
    
    const dateString = dateobject.toLocaleDateString("en-CA") + " " + dateobject.toLocaleTimeString("en-CA")
    return (
    <div id="editViewForm">
    <div className="text-lg text-[var(--foreground)] mb-2">
      <h1 className="text-2xl text-[var(--layout-bar-selected)] pb-4 pt-2">{entry.title}</h1>
      <h1>{entry.cdate == entry.mdate ? "Created on" : "Edited on"}: {dateString}</h1>
      <h1>Created by: {entry.author || "Anonymous"}</h1>
      <h1>Catagory: {entry.catagory || "None"}</h1>
      <h1>Addtional Tags: {entry.tags || "None"}</h1>
      <h1 className="pt-2 text-xl text-[var(--layout-bar-selected)]">Description</h1>
      <h1 className="pb-2">{entry.description || "No description Given"}</h1>
    </div>

    <CodePlace files={props.entry_files}></CodePlace>
    </div>
  );
}