'use client';

import { renpyfilesTable, renpyTable } from "@/db/schema";
import Link from "next/link";
import { useState } from "react";


//TODO: Parsed date should be in a better format. Maybe May 05, 2025
//TODO: We should probably add a prop for "Newly created" just to give the user some feedback the snippet was uploaded
export default function BrowseView(props: {
    entry: (typeof renpyTable.$inferSelect)[];
    entry_files: (typeof renpyfilesTable.$inferSelect)[];
}){
    const [currentTab, setCurrentTab] = useState(0);
    const changeTab = function(ind: number) {
      setCurrentTab(ind);
    }
    const entry = props.entry[0];
    if (!entry){
      return <>This entry does not exists<br/><Link href="/browse">You can find existing snippets here.</Link></>
    }
  return (
    <>
    <h1 className="text-xl">{entry.title}</h1>
    <h1 className="text-lg">Created on: {new Date(entry.cdate).toISOString()}</h1>
    <h1 className="text-lg">Created by: {entry.author || "Anonymous"}</h1>
    <h1 className="text-lg">Catagory: {entry.catagory || "None"}</h1>
    <h1 className="text-lg">Addtional Tags: {entry.tags || "None"}</h1>
    <h1>{entry.description || "No description Given"}</h1>
    <br/>
    <br/>
    <br/>
    <div className="tab">
      {props.entry_files.map((x, ind) => <span key={ind}><button className={"tablinks" + (currentTab == 0 ? " active" : "")}
      onClick={() => changeTab(ind)}
      >
        {x.filename} 
        </button></span>)
        }
    </div>
    <div><textarea rows={10} cols={50} className="codePlace text-red-600" value={props.entry_files[currentTab].code} readOnly></textarea></div>
    </>
  );
}