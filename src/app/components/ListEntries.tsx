"use client";

import { useEffect, useRef, useState } from "react";
import { browseAdvancedSearchSingle } from "@/db/schema";
import { Nunito_Sans } from "next/font/google";
import React from "react";
import ViewSelector, { ViewType } from "../components/ViewSelector";
import { getStoredViewPreference, setStoredViewPreference } from "../utils/storage";
import { getSortFunction, sortOptions } from "../utils/browseUtils";
import { ListView, GridView } from "../utils/browseUtils";
const roboto = Nunito_Sans({ weight: "500", subsets: ["latin"] });

export default function BaseBrowsePage(props: { userId: string | undefined; pageEntries: browseAdvancedSearchSingle[]; title: string }) {
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
    const divRef = useRef<HTMLSelectElement>(null);
    const sortedArray = props.pageEntries.toSorted(getSortFunction(sortBy));

    return (
        <>
            <div className="flex justify-between items-center pb-4 pt-2">
                <h1 className="text-2xl text-[var(--layout-bar-selected)]">{props.title}</h1>
                <ViewSelector currentView={currentView} onViewChange={handleViewChange} />
            </div>
            <div className="grid-rows-2 grid w-80 gap-2 min-h-fit">
                <div className="checkbox-wrapper-14 grid-cols-2 grid" title="Show only snippets that I created">
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
