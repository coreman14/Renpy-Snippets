"use client";

import { browseAdvancedSearchGrouped } from "@/db/schema";
import Link from "next/link";
import { deleteSnippet } from "../../api";
import { useSearchParams } from "next/navigation";
import { getTimeString } from "../snippetTimeFunctions";
import { useState } from "react";
import { DeleteButton } from "../DeleteButton";
import { blankLine } from "../../utils/definitions";

const maximumFilesToShow = 5;

export default function GridView(props: {
    itemsToDisplay: browseAdvancedSearchGrouped[];
    showOnlyUserEntries?: boolean;
    userId?: string;
    showEditedTime?: boolean;
}) {
    const [dateOfCall] = useState(new Date().getTime());
    const searchParams = useSearchParams();
    return (
        <div className="flex flex-wrap gap-6 pb-3 overflow-x-hidden">
            {props.itemsToDisplay
                .filter((x) => !props.showOnlyUserEntries || props.userId == x.snippet.cookie_id)
                .map((x) => (
                    <div
                        key={x.snippet.id}
                        className="grow-0 shrink-0 basis-[calc(33%-1rem)] min-w-[300px] p-4 pt-2 pl-2 border-2 rounded-lg border-[var(--layout-bar-back)] flex-col flex pb-1"
                    >
                        <div className="text-2xl text-[var(--forground-buttons)]">
                            <Link title="View Snippet" href={"/snippet/" + x.snippet.id}>
                                {x.snippet.title}
                            </Link>
                        </div>

                        <div className="text-gray-700 text-sm whitespace-nowrap overflow-x-hidden">
                            {x.snippet.author ? (
                                <>
                                    {"Author: "}
                                    <Link
                                        className="text-[var(--forground-buttons2)]"
                                        href={`/author/${encodeURIComponent(x.snippet.author)}`}
                                        title={"See other snippets by " + x.snippet.author}
                                    >
                                        {x.snippet.author}
                                    </Link>
                                </>
                            ) : (
                                "Author: Anonymous"
                            )}{" | "}
                            {x.snippet.catagory ? (
                                <>
                                    {"Catagory: "}
                                    <Link
                                        className="text-[var(--forground-buttons2)]"
                                        href={`/catagory/${encodeURIComponent(x.snippet.catagory)}`}
                                        title={"See snippets in catagory " + x.snippet.catagory}
                                    >
                                        {x.snippet.catagory}
                                    </Link>
                                </>
                            ) : (
                                "Catagory: None"
                            )}
                        </div>

                        <div className="text-gray-700 text-sm">
                            {(x.snippet.cdate == x.snippet.mdate || !props.showEditedTime ? "Posted" : "Edited") + " "}
                            {getTimeString(dateOfCall, !props.showEditedTime ? x.snippet.cdate : x.snippet.mdate)} Ago
                        </div>

                        
                        <div className="text-[var(--layout-bar-front) mt-2 text-base line-clamp-3 text-ellipsis h-19">
                            {(x.snippet.description|| "No description given").split("\n")[0]}
                        </div>


                        <div className="mt-2 text-sm">
                            <div className="font-bold text-[var(--layout-bar-selected)] text-base">Files:</div>
                            {x.filenames.slice(0, maximumFilesToShow).map((filename, index) => (
                                <Link
                                    key={index}
                                    href={`/snippet/${x.snippet.id}?file=${index + 1}`}
                                    className="block text-[var(--forground-buttons)] hover:underline max-w-fit"
                                    title={"View file " + filename}
                                >
                                    {filename}
                                </Link>
                            ))}
                            {x.filenames.length <= maximumFilesToShow &&
                                new Array(maximumFilesToShow).toSpliced(0, x.filenames.length).map((_, a) => (
                                    <span key={a} className="emptyListSlot block max-w-fit">
                                        {blankLine}
                                    </span>
                                ))}
                            <span className="font-bold text-gray-700 emptyMoreFilesSlot block max-w-fit">
                                {x.filenames.length > maximumFilesToShow
                                    ? `+${x.filenames.length - maximumFilesToShow} more files`
                                    : blankLine}
                            </span>
                        </div>

                        <form action={deleteSnippet} className="text-[var(--forground-buttons2)] mt-auto pt-2 text-xl">
                            <fieldset inert={props.userId != x.snippet.cookie_id} className="*:inert:text-black">
                                <Link href={"/snippet/edit/" + x.snippet.id} title="Edit snippet">
                                    Edit
                                </Link>
                                <DeleteButton />
                                <input type="hidden" value={x.snippet.id} name="id" id="id"></input>
                                <input type="hidden" value="browse" name="currentPage" id="currentPage"></input>
                                <input
                                    type="hidden"
                                    value={searchParams.get("searchTerm") || ""}
                                    name="searchFilter"
                                    id="searchFilter"
                                />
                            </fieldset>
                        </form>
                    </div>
                ))}
        </div>
    );
}
