"use client";

import { useState } from "react";
import { redirect, useSearchParams } from "next/navigation";

export default function SearchBar() {
    const searchParams = useSearchParams()
    const [search, setSearch] = useState(searchParams.get("searchTerm") || "");

    return (
        <input
            id="TopSearchBar"
            type="text"
            value={search}
            onInput={(e) => setSearch(e.currentTarget.value)}
            className="text-[var(--layout-bar-selected)] pl-2 size-fit"
            style={{ "direction": "ltr" }}
            onKeyDown={(e) => {
                if (e.key.includes("Enter") && e.currentTarget.value != "") {
                    redirect("/browse?searchTerm=" + search);
                }
                else if (e.key.includes("Enter") && e.currentTarget.value == "" && searchParams.has("searchTerm")){
                    redirect("/browse")
                }
            }}
            placeholder="Search Snippets..."
            spellCheck={false}
        ></input>
    );
}