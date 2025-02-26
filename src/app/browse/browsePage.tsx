"use client";

import { useEffect, useRef, useState } from "react";
import { browseAdvancedSearchSingle } from "@/db/schema";
import { Nunito_Sans } from "next/font/google";
import React from "react";
import ViewSelector, { ViewType } from "../components/ViewSelector";
import { getStoredViewPreference, setStoredViewPreference } from "../utils/storage";
import { getSortFunction, sortOptions, useRefDimensions } from "../utils/browseUtils";
import ListView from "../components/ListView";
import GridView from "../components/GridView";

const roboto = Nunito_Sans({ weight: "500", subsets: ["latin"] });

export default function BrowsePage(props: { userId: string | undefined; pageEntries: browseAdvancedSearchSingle[] }) {
    const [currentView, setCurrentView] = useState<ViewType>("list");

    useEffect(() => {
        setCurrentView(getStoredViewPreference());
    }, []);

    const handleViewChange = (view: ViewType) => {
        setCurrentView(view);
        setStoredViewPreference(view);
    };
    const [userEntries, setUserEntries] = useState(false);
    const [sortBy, setSortBy] = useState(0);
    const [codeSearch, setCodeSearch] = useState("");
    const divRef = useRef<HTMLSelectElement>(null);
    const dimensions = useRefDimensions(divRef);
    let sortedArray = props.pageEntries.toSorted(getSortFunction(sortBy));
    if (codeSearch) {
        sortedArray = sortedArray.filter((x) =>
            x.files.some((y) => y.filename.includes(codeSearch) || y.code.includes(codeSearch))
        );
    }

    return (
        <>
            <div className="flex justify-between items-center pb-4 pt-2">
                <h1 className="text-2xl text-[var(--layout-bar-selected)]">Browse All</h1>
                <ViewSelector currentView={currentView} onViewChange={handleViewChange} />
            </div>
            <div className="grid-rows-3 grid w-80 gap-2 min-h-fit">
                <div className="checkbox-wrapper-14 grid-cols-2 grid">
                    <label htmlFor="showUsersSnippets">Show my snippets:</label>
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
                        className={"text-[var(--layout-bar-selected)] text-[18px] size-fit " + roboto.className}
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
                        className={"text-[var(--layout-bar-selected)] text-[18px] pl-2 size-fit" + roboto.className}
                        type="text"
                        placeholder="Search code..."
                        style={{ width: dimensions.width, height: dimensions.height }}
                    ></input>
                </div>
            </div>
            <br />
            <div>
                {currentView === "list" ? (
                    <ListView
                        itemsToDisplay={sortedArray}
                        showOnlyUserEntries={userEntries}
                        userId={props.userId}
                        showEditedTime={true}
                    />
                ) : (
                    <GridView
                        itemsToDisplay={sortedArray}
                        showOnlyUserEntries={userEntries}
                        userId={props.userId}
                        showEditedTime={true}
                    />
                )}
            </div>
        </>
    );
}
