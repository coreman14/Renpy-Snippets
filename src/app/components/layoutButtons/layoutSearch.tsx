"use client";

import { useState } from "react";
import { redirect, useSearchParams } from "next/navigation";

export function searchOptions() {
    return ["searchTerm", "searchCode"];
}
export default function SearchBar() {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("searchTerm") || "");
    const [searchType, setsearchType] = useState(0);

    return (
        <>
            <input
                id="TopSearchBar"
                type="text"
                value={search}
                onInput={(e) => setSearch(e.currentTarget.value)}
                className="text-[var(--layout-bar-selected)] pl-2 size-fit"
                style={{ "direction": "ltr" }}
                onKeyDown={(e) => {
                    let newLocation = "";
                    if (e.key.includes("Enter") && e.currentTarget.value != "") {
                        newLocation = "/browse?" + searchOptions()[searchType] + "=" + search;
                    } else if (
                        e.key.includes("Enter") &&
                        e.currentTarget.value == "" &&
                        (searchParams.has("searchTerm") || searchParams.has("searchCode"))
                    ) {
                        redirect("/browse");
                    }
                    if (newLocation) {
                        redirect(newLocation);
                    }
                }}
                placeholder={"Search " + (searchType == 0 ? "Snippets" : "Code")}
                spellCheck={false}
            ></input>
            <span onClick={() => setsearchType(searchType == 0 ? 1 : 0)}
            dir="ltr"
                className="hover pr-2 text-[var(--layout-bar-selected)]"
                title={"Search Snippets: Check the Title, author, catagory, Tags and Description\nSeach Code: Check each files name and contents"}
                >
                Search {searchType == 0 ? "Snippets" : "Code"}
            </span>
        </>
    );
}
