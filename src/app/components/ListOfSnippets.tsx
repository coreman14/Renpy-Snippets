'use client'
import { browseAdvancedSearchSingle } from "@/db/schema";
import Link from "next/link";
import { deleteSnippet } from "../api";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { getTimeString } from "./snippetDisplayFunction";

export default function ListOfSnippets(props: {
    itemsToDisplay: browseAdvancedSearchSingle[];
    showOnlyUserEntries?: boolean;
    userId?: string | undefined;
    showEditedTime?: boolean;
}){
    const [dateOfCall] = useState(new Date().getTime());
    const searchParams = useSearchParams();
    return props.itemsToDisplay.filter((x) => !props.showOnlyUserEntries || props.userId == x.snippet.cookie_id)
        .map((x) => (
            <div key={x.snippet.id}>
                <div className="text-2xl text-[var(--forground-buttons)]">
                    <Link title="View Snippet" href={"/entry/" + x.snippet.id}>
                        {x.snippet.title}
                    </Link>
                </div>

                <div className="additionalDetails text-gray-700">
                    {x.snippet.author ? "Author: " + x.snippet.author : "Author: Anonymous"}
                    {" "}| Catagory: {x.snippet.catagory || "None"} |{" " + (x.snippet.cdate == x.snippet.mdate || !props.showEditedTime ? "Posted" : "Edited")}{" "}
                    {getTimeString(dateOfCall, !props.showEditedTime ? x.snippet.cdate :  x.snippet.mdate )} Ago
                    {x.snippet.description && " | " + x.snippet.description.split("\n")[0].replace(/(.{30})..+/, "$1…")}
                </div>
                {props.userId == x.snippet.cookie_id ? (
                    <>
                        <form action={deleteSnippet} className="text-xl text-[var(--forground-buttons2)]">
                            <Link href={"/entry/edit/" + x.snippet.id} title="Edit snippet">
                                Edit
                            </Link>
                            <DeleteButton />
                            <input type="hidden" value={x.snippet.id} name="id" id="id"></input>
                            <input
                                type="hidden"
                                value={searchParams.get("searchTerm") || ""}
                                name="searchFilter"
                                id="searchFilter"
                            />
                        </form>
                    </>
                ) : (
                    ""
                )}
                <br />
            </div>
        ))}


function DeleteButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="disabled:text-black pl-2" title="Delete Snippet">
            Delete
        </button>
    );
}