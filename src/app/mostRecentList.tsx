'use client'
import { browseAdvancedSearchGrouped } from "@/db/schema";
import { ListView, GridView } from "./utils/browseUtils";
import Link from "next/link";
import ViewSelector, { ViewType } from "./components/ViewSelector";
import { useState, useEffect } from "react";
import { getStoredViewPreference, setStoredViewPreference } from "./utils/storage";

export default function MostRecent(props: {
    userId: string | undefined;
    pageEntries: browseAdvancedSearchGrouped[];
    showMoreSnippets: boolean;
}) {

    const [currentView, setCurrentView] = useState<ViewType>('list');
    
    useEffect(() => {
        setCurrentView(getStoredViewPreference());
    }, []);

    const handleViewChange = (view: ViewType) => {
        setCurrentView(view);
        setStoredViewPreference(view);
    };


    return (
        <>
            <div className="flex justify-between items-center pb-4 pt-2">
                <h1 className="text-2xl text-[var(--layout-bar-selected)]">Most Recent Submissions</h1>
                <ViewSelector currentView={currentView} onViewChange={handleViewChange} />
            </div>
            <div>
                {currentView === "list" ? (
                    <ListView itemsToDisplay={props.pageEntries} showOnlyUserEntries={false} userId={props.userId} />
                ) : (
                    <GridView itemsToDisplay={props.pageEntries} showOnlyUserEntries={false} userId={props.userId} />
                )}
            </div>
            {props.showMoreSnippets && <Link className="text-xl text-[var(--forground-buttons2)]" href="/browse">See all snippets</Link>}
        </>
    );
}
