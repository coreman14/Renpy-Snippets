'use client'
import {  renpyTable } from "@/db/schema";
import ListOfSnippets from "./components/ListOfSnippets";
import Link from "next/link";

export default function MostRecent(props: {
    userId: string | undefined;
    pageEntries: typeof renpyTable.$inferSelect[];
    limit?: number;
}) {
    const limit = props.limit || 6;
    let overLimit = false;
    let entries = props.pageEntries;
    if (entries.length > limit){
        overLimit = true;
        entries = entries.slice(0, limit)
    }
    return (
        <>
            <h1 className="text-2xl text-[var(--layout-bar-selected)] pb-4 pt-2">Most Recent Submissions</h1>
            <div>
            <ListOfSnippets itemsToDisplay={entries} showOnlyUserEntries={false} userId={props.userId}></ListOfSnippets>
            </div>
            {overLimit && <Link className="text-sm text-[var(--forground-buttons2)]" href="/browse">See all snippets</Link>}

        </>
    );
}
