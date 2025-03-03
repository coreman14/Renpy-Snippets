'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LayoutLink(props : {
    href: string;
    text: string;
}) {
    const pathname = usePathname()
    return (
        <Link
            className={`whitespace-nowrap pr-2 ${pathname === props.href ? "text-[var(--layout-bar-selected)]" : ""} `}
            href={props.href}
            title={`Go to ${props.text}`}
        >
            {props.text}
        </Link>
    );
}
