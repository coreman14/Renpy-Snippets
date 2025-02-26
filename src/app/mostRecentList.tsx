'use client'
import { browseAdvancedSearchSingle } from "@/db/schema";
import { ListView, GridView } from "./utils/browseUtils";
import Link from "next/link";
import ViewSelector, { ViewType } from "./components/ViewSelector";
import { useState, useEffect } from "react";
import { getStoredViewPreference, setStoredViewPreference } from "./utils/storage";

export default function MostRecent(props: {
    userId: string | undefined;
    pageEntries: browseAdvancedSearchSingle[];
    limit?: number;
}) {
    const limit = props.limit || 6;
    const [currentView, setCurrentView] = useState<ViewType>('list');
    
    useEffect(() => {
        setCurrentView(getStoredViewPreference());
    }, []);

    const handleViewChange = (view: ViewType) => {
        setCurrentView(view);
        setStoredViewPreference(view);
    };

    let overLimit = false;
    let entries = props.pageEntries;
    if (entries.length > limit) {
        overLimit = true;
        entries = entries.slice(0, limit)
    }

    return (
        <>
            <div className="flex justify-between items-center pb-4 pt-2">
                <h1 className="text-2xl text-[var(--layout-bar-selected)]">Most Recent Submissions</h1>
                <ViewSelector currentView={currentView} onViewChange={handleViewChange} />
            </div>
            <div>
                {currentView === "list" ? (
                    <ListView itemsToDisplay={entries} showOnlyUserEntries={false} userId={props.userId} />
                ) : (
                    <GridView itemsToDisplay={entries} showOnlyUserEntries={false} userId={props.userId} />
                )}
            </div>
            {overLimit && <Link className="text-xl text-[var(--forground-buttons2)]" href="/browse">See all snippets</Link>}
        </>
    );
}
