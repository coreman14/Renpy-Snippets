"use client";
import { browseAdvancedSearchGrouped } from "@/db/schema";
import Link from "next/link";
import { deleteSnippet } from "../../api";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getTimeString } from "../snippetTimeFunctions";
import { DeleteButton } from "../DeleteButton";

export default function ListView(props: {
    itemsToDisplay: browseAdvancedSearchGrouped[];
    showOnlyUserEntries?: boolean;
    userId?: string | undefined;
    showEditedTime?: boolean;
}) {
    const [dateOfCall] = useState(new Date().getTime());
    const searchParams = useSearchParams();
    return props.itemsToDisplay
        .filter((x) => !props.showOnlyUserEntries || props.userId == x.snippet.cookie_id)
        .map((x) => (
            <div key={x.snippet.id} className="pb-6 last-of-type:pb-4">
                <div className="text-2xl text-[var(--forground-buttons)]">
                    <Link title="View Snippet" href={"/snippet/" + x.snippet.id}>
                        {x.snippet.title}
                    </Link>
                </div>

                <div className="additionalDetails text-gray-700">
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
                    )}{" "}
                    |{" "}
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
                    )}{" "}
                    |{" " + (x.snippet.cdate == x.snippet.mdate || !props.showEditedTime ? "Posted" : "Edited")}{" "}
                    {getTimeString(dateOfCall, !props.showEditedTime ? x.snippet.cdate : x.snippet.mdate)} Ago
                    {x.snippet.description && " | " + x.snippet.description.split("\n")[0].replace(/(.{30})..+/, "$1…")}
                </div>

                <form
                    action={deleteSnippet}
                    className="text-xl text-[var(--forground-buttons2)]"
                    title={props.userId != x.snippet.cookie_id ? "User does not have modify permissions" : ""}
                >
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
        ));
}
