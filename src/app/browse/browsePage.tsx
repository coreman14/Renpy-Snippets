'use client';

import Link from "next/link";
import { deleteSnippet } from "../api";
import { useState } from "react";
import { renpyTable } from "@/db/schema";

import * as timeDelta from 'time-delta';
// @ts-expect-error Locales are not marked as exported correctly, but we can still access all of them
import enLocale from 'time-delta/locales/en';
timeDelta.addLocale(enLocale);
const instance = timeDelta.create({
    locale: 'en', // default
    span: 1,
    unitType: "long"
  });

function getTimeString(time1: number, time2: number){
    let date1, date2;
    if (time1 < time2){
        date1 = new Date(time1);
        date2 = new Date(time2);
    }
    else{
        date1 = new Date(time2);
        date2 = new Date(time1);
    }
    return instance.format(date1, date2)
}

export default function BrowsePage(props : {
    userId: string | undefined;
    pageEntries:  (typeof renpyTable.$inferSelect)[];
    dateOfCall:  number;
}) {
    const [userEntries, setUserEntries] = useState(false);

    return <>
    <h1>Browse page</h1>
    <input type="checkbox" checked={userEntries} onChange={() => setUserEntries((a) => !a)}
    name="showUsersSnippets"/><label htmlFor="showUsersSnippets">Hide other user snippets</label>
    <br/>
    <br/>
    {
        props.pageEntries.filter((x) => !userEntries || props.userId == x.cookie_id).map((x) => <div key={x.id}><Link href={"/entry/" + x.id}>{x.title} - {x.author || "Anonymous"} </Link>
        <div className="additionalDetails text-gray-500" >
            Catagory: {x.catagory || "None"} |
            {" " + (x.cdate == x.mdate ? "Posted" : "Edited")} {getTimeString(props.dateOfCall , x.mdate)} Ago
            {x.description && "| " + x.description.split("\n")[0].replace(/(.{30})..+/, "$1…")}</div>
        {props.userId == x.cookie_id ?
        <><form action={deleteSnippet} className="text-cyan-500" ><Link href={"/entry/edit/" + x.id}>Edit</Link>
                    <button type="submit" className="pl-2">Delete</button>
                    <input type="hidden" value={x.id} name="id" id="id"></input>
                </form></> : ""}<br/></div>)
    }
    </>
  }
