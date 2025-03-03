"use client";

import { useEffect, useRef, useState } from "react";
import { browseAdvancedSearchGrouped } from "@/db/schema";
import { Nunito_Sans } from "next/font/google";
import React from "react";
import ViewSelector, { ViewType } from "./ViewSelector";
import { getStoredViewPreference, setStoredViewPreference } from "../utils/storage";
import { getSortFunction, sortOptions } from "../utils/browseUtils";
import { ListView, GridView } from "../utils/browseUtils";
const roboto = Nunito_Sans({ weight: "500", subsets: ["latin"] });

export default function BaseBrowsePage(props: { userId: string | undefined; pageEntries: browseAdvancedSearchGrouped[]; title: string }) {
    const [currentView, setCurrentView] = useState<ViewType>("list");

    useEffect(() => {
        setCurrentView(getStoredViewPreference());
    }, []);

    const handleViewChange = (view: ViewType) => {
        setCurrentView(view);
        setStoredViewPreference(view);
    };
    const [userEntries, setUserEntries] = useState(false);
    const [pageEntries, setPageEntries] = useState(props.pageEntries);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage] = useState(21);
    const [sortBy, setSortBy] = useState(0);
    const divRef = useRef<HTMLSelectElement>(null);
    const paginationRef = useRef<HTMLDivElement>(null);
    const scrollToPagination = () => {
        setTimeout(() => {
            paginationRef.current?.scrollIntoView({ block: 'center' });
        }, 0);
    };
    if (pageEntries != props.pageEntries){ //Force refresh if our props have changed
        setPageEntries(props.pageEntries)
        setCurrentPage(1)
    }
    const sortedArray = pageEntries.toSorted(getSortFunction(sortBy));
    const filteredArray = userEntries ? sortedArray.filter(x => x.snippet.cookie_id === props.userId) : sortedArray;
    const totalPages = Math.ceil(filteredArray.length / resultsPerPage);
    if (filteredArray.length < (currentPage * resultsPerPage) && currentPage != 1 && currentPage != totalPages){ //Never let the current page be greater than the max page
        setCurrentPage(1)
    }
    const currentPageData = filteredArray.slice((currentPage -1) * resultsPerPage, currentPage * resultsPerPage);
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            scrollToPagination();
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            scrollToPagination();
        }
    };

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
                        onChange={() => {setUserEntries((a) => !a); setCurrentPage(1)}}
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
                        itemsToDisplay={currentPageData}
                        showOnlyUserEntries={userEntries}
                        userId={props.userId}
                        showEditedTime={true}
                    />
                ) : (
                    <GridView
                        itemsToDisplay={currentPageData}
                        showOnlyUserEntries={userEntries}
                        userId={props.userId}
                        showEditedTime={true}
                    />
                )}
            </div>
            <div className="flex flex-row gap-4 justify-between items-center mt-4" ref={paginationRef}>
                <div>
                    <button 
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[var(--layout-bar-back)] hover:bg-[var(--layout-bar-selected)]'}`}
                    >
                        Previous Page
                    </button>
                </div>
                <div>
                    <span className="text-[var(--layout-bar-selected)]">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                </div>
                <div>
                    <button 
                        onClick={nextPage}
                        disabled={currentPage >= totalPages}
                        className={`px-4 py-2 rounded ${currentPage >= totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[var(--layout-bar-back)] hover:bg-[var(--layout-bar-selected)]'}`}
                    >
                        Next Page
                    </button>
                </div>
            </div>
        </>
    );
}
