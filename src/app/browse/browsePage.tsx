"use client";

import { useRef, useState } from "react";
import { renpyTable } from "@/db/schema";

import ListOfSnippets from "../components/ListOfSnippets";
import { Nunito_Sans } from "next/font/google";
import React from "react";
const roboto = Nunito_Sans({weight: "500"});

const useRefDimensions = (ref: React.RefObject<HTMLSelectElement | null>) => {
    const [dimensions, setDimensions] = useState({ width: 200, height: 26 })
    React.useEffect(() => {
      if (ref.current) {
        const { current } = ref
        const boundingRect = current.getBoundingClientRect()
        const { width, height } = boundingRect
        setDimensions({ width: Math.round(width), height: Math.round(height) })
      }
    }, [ref])
    return dimensions
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
    pageEntries: typeof renpyTable.$inferSelect[];
}) {
    const [userEntries, setUserEntries] = useState(false);
    const [sortBy, setSortBy] = useState(0);
    // 0 => Edit new to old, 1 Edit old to new, 2 Created new to old, 3 Created old to new, 4 title a-z, 5 title z-a, 6 catagory a-z, 7 catagory z-a
    const [codeSearch, setCodeSearch] = useState("");
    const divRef = useRef<HTMLSelectElement>(null);
    const dimensions = useRefDimensions(divRef);
    const sortedArray = props.pageEntries.toSorted(getSortFunction(sortBy));
    // if (codeSearch){
    //     sortedArray = sortedArray.filter((x) => x)
    // }
    return (
        <>
            <h1 className="text-2xl text-[var(--layout-bar-selected)] pb-4 pt-2">Browse All</h1>
            <div className="grid-rows-3 grid w-1/4 gap-2">
                <div className="checkbox-wrapper-14 grid-cols-2 grid">
                    <label htmlFor="showUsersSnippets">Hide other user snippets:</label>
                    <input
                        id="showUsersSnippets"
                        type="checkbox"
                        className="switch"
                        checked={userEntries}
                        onChange={() => setUserEntries((a) => !a)}
                    />
                </div>

                <div className="grid-cols-2 grid">
                    <label htmlFor="sortResults">Sort results by: </label>
                    <select
                        name="sortResults"
                        id="sortResults"
                        onChange={(x) => setSortBy(parseInt(x.target.value))}
                        className={"text-[var(--layout-bar-selected)] text-[18px] size-fit " + roboto.className }
                        ref={divRef}
                    >
                        {sortOptions().map((x, ind) => (
                            <option key={x} value={ind}>
                                {x}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid-cols-2 grid">
                    <label htmlFor="codeSearch">Advanced search:</label>
                    <input
                        name="codeSearch"
                        id="codeSearch"
                        value={codeSearch}
                        onInput={(e) => setCodeSearch(e.currentTarget.value)}
                        className={"text-[var(--layout-bar-selected)] text-[18px] pl-2 size-fit" + roboto.className }
                        type="text"
                        placeholder="Search code..."
                        style={{width: dimensions.width, height: dimensions.height}}
                    >
                    </input>
                </div>
            </div>
            <br/>
            <ListOfSnippets
                itemsToDisplay={sortedArray}
                showOnlyUserEntries={userEntries}
                userId={props.userId}
                showEditedTime={true}
            ></ListOfSnippets>
        </>
    );
}
