import { browseAdvancedSearchSingle } from "@/db/schema";
import { useState } from "react";
import React from "react";

import dynamic from "next/dynamic";

const LoadingView = () => <h1 className="text-2xl text-[var(--layout-bar-selected)]">Loading Snippets...</h1>

export const ListView = dynamic(() => import("../components/ListView"), {
    ssr: false,
    loading: LoadingView
});

export const GridView = dynamic(() => import("../components/GridView"), {
    ssr: false,
    loading: LoadingView
});

export const useRefDimensions = (ref: React.RefObject<HTMLSelectElement | null>) => {
    const [dimensions, setDimensions] = useState({ width: 200, height: 26 });
    React.useEffect(() => {
        if (ref.current) {
            const { current } = ref;
            const boundingRect = current.getBoundingClientRect();
            const { width, height } = boundingRect;
            setDimensions({ width: Math.round(width), height: Math.round(height) });
        }
    }, [ref]);
    return dimensions;
};

export function sortOptions() {
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

export function getSortFunction(functionToGet: number) {
    // 0 => Edit new to old, 1 Edit old to new, 2 Created new to old, 3 Created old to new, 4 title a-z, 5 title z-a, 6 catagory a-z, 7 catagory z-a
    switch (functionToGet) {
        case 0:
            return (a: browseAdvancedSearchSingle, b: browseAdvancedSearchSingle) =>
                a.snippet.mdate > b.snippet.mdate ? -1 : 1;
        case 1:
            return (a: browseAdvancedSearchSingle, b: browseAdvancedSearchSingle) =>
                a.snippet.mdate < b.snippet.mdate ? -1 : 1;
        case 2:
            return (a: browseAdvancedSearchSingle, b: browseAdvancedSearchSingle) =>
                a.snippet.cdate > b.snippet.cdate ? -1 : 1;
        case 3:
            return (a: browseAdvancedSearchSingle, b: browseAdvancedSearchSingle) =>
                a.snippet.cdate < b.snippet.cdate ? -1 : 1;
        case 4:
            return (a: browseAdvancedSearchSingle, b: browseAdvancedSearchSingle) =>
                a.snippet.title > b.snippet.title ? 1 : -1;
        case 5:
            return (a: browseAdvancedSearchSingle, b: browseAdvancedSearchSingle) =>
                a.snippet.title < b.snippet.title ? 1 : -1;
        case 6:
            return (a: browseAdvancedSearchSingle, b: browseAdvancedSearchSingle) =>
                (a.snippet.catagory || "") > (b.snippet.catagory || "") ? 1 : -1;
        case 7:
            return (a: browseAdvancedSearchSingle, b: browseAdvancedSearchSingle) =>
                (a.snippet.catagory || "") < (b.snippet.catagory || "") ? 1 : -1;
    }
}


