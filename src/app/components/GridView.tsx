'use client'

import { browseAdvancedSearchSingle } from "@/db/schema";
import Link from "next/link";
import { deleteSnippet } from "../api";
import { useSearchParams } from "next/navigation";
import { getTimeString } from "./snippetDisplayFunction";
import { useState } from "react";
import { DeleteButton } from "./DeleteButton";
import { blankLine } from "../utils/definitions";

export default function GridView(props: {
    itemsToDisplay: browseAdvancedSearchSingle[];
    showOnlyUserEntries?: boolean;
    userId?: string;
    showEditedTime?: boolean;
}) {
    const [dateOfCall] = useState(new Date().getTime());
    const searchParams = useSearchParams();
    
    return (
        <div className="flex flex-wrap gap-6 pb-3">
            {props.itemsToDisplay
                .filter((x) => !props.showOnlyUserEntries || props.userId == x.snippet.cookie_id)
                .map((x) => (
                    <div key={x.snippet.id} className="grow-0 shrink-0 basis-[calc(33%-1rem)] min-w-[300px] p-4 pt-2 pl-2 border-2 rounded-lg border-[var(--layout-bar-back)] flex-col flex pb-1">
                        <div className="text-2xl text-[var(--forground-buttons)]">
                            <Link title="View Snippet" href={"/entry/" + x.snippet.id}>
                                {x.snippet.title}
                            </Link>
                        </div>

                        <div className="text-gray-700 text-sm">
                            {x.snippet.author ? "Author: " + x.snippet.author : "Author: Anonymous"}
                            {" "}| Catagory: {x.snippet.catagory || "None"}
                        </div>
                        
                        <div className="text-gray-700 text-sm">
                            {(x.snippet.cdate == x.snippet.mdate || !props.showEditedTime ? "Posted" : "Edited") + " "}
                            {getTimeString(dateOfCall, !props.showEditedTime ? x.snippet.cdate : x.snippet.mdate)} Ago
                        </div>

                        {x.snippet.description && (
                            <div className="text-[var(--layout-bar-front) mt-2 text-base">
                                {x.snippet.description.split("\n")[0].replace(/(.{150})..+/, "$1…")}
                            </div>
                        )}

                        <div className="mt-2 text-sm">
                            <div className="font-bold text-[var(--layout-bar-selected)] text-base">Files:</div>
                            {x.files.slice(0,5).map((file, index) => (
                                <Link
                                    key={index}
                                    href={`/entry/${x.snippet.id}?file=${index + 1}`}
                                    className="block text-[var(--forground-buttons)] hover:underline max-w-fit"
                                >
                                    {file.filename}
                                </Link>
                            ))}
                            {x.files.length > 5 && <span className="font-bold text-gray-700">+{x.files.length - 5} more files</span>} 
                        </div>

                        {props.userId == x.snippet.cookie_id && (
                            <form action={deleteSnippet} className="text-[var(--forground-buttons2)] mt-auto pt-2 text-xl">
                                <Link href={"/entry/edit/" + x.snippet.id} title="Edit snippet">
                                    Edit
                                </Link>
                                <DeleteButton />
                                <input type="hidden" value={x.snippet.id} name="id" />
                                <input type="hidden" value={searchParams.get("searchTerm") || ""} name="searchFilter" />
                                <input type="hidden" value="recent" name="currentPage" id="currentPage"></input>
                            </form>
                        ) || blankLine}
                    </div>
                ))}
        </div>
    );
}


