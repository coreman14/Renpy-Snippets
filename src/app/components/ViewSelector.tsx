'use client'

import { Nunito_Sans } from "next/font/google";
const roboto = Nunito_Sans({weight: "500", subsets: ["latin"]});

export type ViewType = "list" | "grid";

export default function ViewSelector({ currentView, onViewChange }: { 
    currentView: ViewType, 
    onViewChange: (view: ViewType) => void 
}) {
    return (
        <select
            value={currentView}
            onChange={(e) => onViewChange(e.target.value as ViewType)}
            className={"text-[var(--layout-bar-selected)] text-[18px] size-fit " + roboto.className}
        >
            <option value="list">List View</option>
            <option value="grid">Grid View</option>
        </select>
    );
}
