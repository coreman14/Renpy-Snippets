'use client';

import Link from "next/link";
import { deleteSnippet } from "../api";
import { useState } from "react";
import { renpyTable } from "@/db/schema";
export default function BrowsePage(props : {
    userId: string | undefined;
    pageEntries:  (typeof renpyTable.$inferSelect)[];
}) {
    const [userEntries, setUserEntries] = useState(false);
    return <>
    <h1>Browse page</h1>
    <input type="checkbox" checked={userEntries} onChange={() => setUserEntries((a) => !a)}
    name="showUsersSnippets"/><label htmlFor="showUsersSnippets">Hide other user snippets</label>
    <br/>
    <br/>
    {
        props.pageEntries.filter((x) => !userEntries || props.userId == x.cookie_id).map((x) => <div key={x.id}><Link href={"/entry/" + x.id}>{x.title}</Link>
        {props.userId == x.cookie_id ?
        <><Link href={"/entry/edit/" + x.id}>___Edit<br /></Link><form action={deleteSnippet}>
                    <input type="submit" value="Delete"/>
                    <input type="hidden" value={x.id} name="id" id="id"></input>
                </form></> : ""}</div>)
    }
    </>
  }
