"use client";

import Link from "next/link";
import { deleteSnippet } from "../api";
import { useState } from "react";
import { renpyTable } from "@/db/schema";

import * as timeDelta from "time-delta";
// @ts-expect-error Locales are not marked as exported correctly, but we can still access all of them
import enLocale from "time-delta/locales/en";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";

timeDelta.addLocale(enLocale);
const instance = timeDelta.create({
    locale: "en",
    span: 1,
    unitType: "long",
});

function getTimeString(time1: number, time2: number) {
    let date1, date2;
    if (time1 < time2) {
        date1 = new Date(time1);
        date2 = new Date(time2);
    } else {
        date1 = new Date(time2);
        date2 = new Date(time1);
    }
    return instance.format(date1, date2);
}

function sortOptions() {
    return [
        "Date Modified (newest first)",
        "Date Modified (oldest first)",
        "Date Created (newest first)",
        "Date Created (oldest first)",
        "Title (A-Z)",
        "Title (Z-A)",
        "Catagory (A-Z)",
        "Catagory (Z-A)",
    ];
}

function getSortFunction(functionToGet: number) {
    // 0 => Edit new to old, 1 Edit old to new, 2 Created new to old, 3 Created old to new, 4 title a-z, 5 title z-a, 6 catagory a-z, 7 catagory z-a
    switch (functionToGet) {
        case 0:
            return (a: typeof renpyTable.$inferSelect, b: typeof renpyTable.$inferSelect) =>
                a.mdate > b.mdate ? -1 : 1;
        case 1:
            return (a: typeof renpyTable.$inferSelect, b: typeof renpyTable.$inferSelect) =>
                a.mdate < b.mdate ? -1 : 1;
        case 2:
            return (a: typeof renpyTable.$inferSelect, b: typeof renpyTable.$inferSelect) =>
                a.cdate > b.cdate ? -1 : 1;
        case 3:
            return (a: typeof renpyTable.$inferSelect, b: typeof renpyTable.$inferSelect) =>
                a.cdate < b.cdate ? -1 : 1;
        case 4:
            return (a: typeof renpyTable.$inferSelect, b: typeof renpyTable.$inferSelect) =>
                a.title > b.title ? 1 : -1;
        case 5:
            return (a: typeof renpyTable.$inferSelect, b: typeof renpyTable.$inferSelect) =>
                a.title < b.title ? 1 : -1;
        case 6:
            return (a: typeof renpyTable.$inferSelect, b: typeof renpyTable.$inferSelect) =>
                (a.catagory || "") > (b.catagory || "") ? 1 : -1;
        case 7:
            return (a: typeof renpyTable.$inferSelect, b: typeof renpyTable.$inferSelect) =>
                (a.catagory || "") < (b.catagory || "") ? 1 : -1;
    }
}

export default function BrowsePage(props: {
    userId: string | undefined;
    pageEntries: (typeof renpyTable.$inferSelect)[];
    dateOfCall: number;
}) {
    const [userEntries, setUserEntries] = useState(false);
    const [sortBy, setSortBy] = useState(0);
    const searchParams = useSearchParams();
    // 0 => Edit new to old, 1 Edit old to new, 2 Created new to old, 3 Created old to new, 4 title a-z, 5 title z-a, 6 catagory a-z, 7 catagory z-a
    const sortedArray = props.pageEntries.toSorted(getSortFunction(sortBy));
    return (
        <>
            <h1 className="text-2xl text-[var(--title)]">Browse page</h1>
            <input
                type="checkbox"
                checked={userEntries}
                onChange={() => setUserEntries((a) => !a)}
                name="showUsersSnippets"
                id="showUsersSnippets"
            />
            <label htmlFor="showUsersSnippets">Hide other user snippets</label>
            <br />
            <label htmlFor="sortResults">Sort results by: </label>
            <select
                name="sortResults"
                id="sortResults"
                onChange={(x) => setSortBy(parseInt(x.target.value))}
                className="text-[var(--forground-buttons)]"
            >
                {sortOptions().map((x, ind) => (
                    <option key={x} value={ind}>
                        {x}
                    </option>
                ))}
            </select>
            <br />
            <br />
            {sortedArray
                .filter((x) => !userEntries || props.userId == x.cookie_id)
                .map((x) => (
                    <div key={x.id}>
                        <div className="text-xl text-[var(--forground-buttons)]">
                            <Link title="View Snippet" href={"/entry/" + x.id}>
                                {x.title}
                            </Link>
                        </div>

                        <div className="additionalDetails text-gray-700">
                            {x.author ? "Author: " + x.author : "Author: Anonymous"}
                            {" "}| Catagory: {x.catagory || "None"} |{" " + (x.cdate == x.mdate ? "Posted" : "Edited")}{" "}
                            {getTimeString(props.dateOfCall, x.mdate)} Ago
                            {x.description && " | " + x.description.split("\n")[0].replace(/(.{30})..+/, "$1…")}
                        </div>
                        {props.userId == x.cookie_id ? (
                            <>
                                <form action={deleteSnippet} className="text-sm text-[var(--forground-buttons2)]">
                                    <Link href={"/entry/edit/" + x.id} title="Edit snippet">
                                        Edit
                                    </Link>
                                    <DeleteButton />
                                    <input type="hidden" value={x.id} name="id" id="id"></input>
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
        </>
    );
}

function DeleteButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="disabled:text-black pl-2" title="Delete Snippet">
            Delete
        </button>
    );
}
