"use client";

import { deleteSnippet } from "@/app/api";
import { DeleteButton } from "@/app/components/DeleteButton";
import CodePlace from "@/app/components/fileViewer";
import { DB_renpyFileTable, DB_renpyTable} from "@/db/schema";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function SnippetView(props: {
    entry: DB_renpyTable[];
    entry_files: DB_renpyFileTable[];
    userId?: string;
    vanity?: string;
}) {
    const entry = props.entry[0];
    const dateToUse = entry ? (entry.cdate == entry.mdate ? entry.cdate : entry.mdate) : "";
    const [dateobject] = useState(new Date(dateToUse));
    const [vanityIsClicked, setVanityIsClicked] = useState(false);
    const urlRef = useRef<HTMLImageElement>(null);
    useEffect(() => {
        //If we have a vanity url, show what link they will be copying
        if (urlRef.current){
            urlRef.current.title = `Copy short url to clipboard (${location.origin + "/s/" + props.vanity})`
        }
    })
    if (!entry) {
        return (
            <>
                <h1 className="text-2xl text-[var(--layout-bar-selected)] pb-4 pt-2">Entry Not Found</h1>This snippet
                does not exist.
                <br />
                <Link href="/browse" className="text-[var(--forground-buttons)]">
                    You can find existing snippets here.
                </Link>
            </>
        );
    }

    const dateString =
        dateobject.toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" }) +
        " at " +
        dateobject.toLocaleTimeString("en-CA", { hour: "numeric", minute: "numeric" });

    function copyUrlToClipboard(){
        navigator.clipboard.writeText(location.origin + "/s/" + props.vanity);
        setVanityIsClicked(true)
    }

    return (
        <div id="editViewForm">
            <div className="text-lg text-[var(--foreground)] mb-2">
                <h1 className="text-2xl text-[var(--layout-bar-selected)] pb-4 pt-2">
                    {entry.title}{" "}
                    {props.vanity ? (<>
                        <Image src="/copy-url.svg" alt="Copy Vanity URL" width={28} height={28}
                        className={"inline hover align-text-bottom " + (vanityIsClicked ? "urlCopied" : "urlCopy")}
                        ref={urlRef}
                        onClick={() => copyUrlToClipboard()}
                        ></Image>{vanityIsClicked && <span className="pl-2 text-[var(--correct-text)]">Copied Short link</span>}
                        </>
                    ) : (
                        ""
                    )}
                </h1>
                <h1>
                    {entry.cdate == entry.mdate ? "Created on" : "Edited on"}: {dateString}
                </h1>
                <h1>
                    Created by:{" "}
                    {entry.author ? (
                        <>
                            <Link
                                className="text-[var(--forground-buttons2)]"
                                href={`/author/${encodeURIComponent(entry.author)}`}
                                title={"See other snippets by " + entry.author}
                            >
                                {entry.author}
                            </Link>
                        </>
                    ) : (
                        "Anonymous"
                    )}
                </h1>
                <h1>
                    Catagory:{" "}
                    {entry.catagory ? (
                        <>
                            <Link
                                className="text-[var(--forground-buttons2)]"
                                href={`/catagory/${encodeURIComponent(entry.catagory)}`}
                                title={"See snippets in catagory " + entry.catagory}
                            >
                                {entry.catagory}
                            </Link>
                        </>
                    ) : (
                        "Anonymous"
                    )}
                </h1>
                <h1>
                    Addtional Tags:{" "}
                    {entry.tags
                        ? entry.tags.split(",").map((x, ind) => (
                              <span key={x}>
                                  <Link
                                      className="text-[var(--forground-buttons2)]"
                                      href={`/tag/${encodeURIComponent(x)}`}
                                      title={"See snippets with tag " + x}
                                  >
                                      {" "}
                                      {x.trim()}
                                  </Link>
                                  {entry.tags?.split(",").length != ind + 1 ? "," : ""}
                              </span>
                          ))
                        : "None"}
                </h1>
                <h1 className="pt-2 text-xl text-[var(--layout-bar-selected)]">Description</h1>
                <h1 className="pb-2">{entry.description || "No description Given"}</h1>
            </div>

            <CodePlace files={props.entry_files}></CodePlace>
            {props.userId != entry.cookie_id ? (
                ""
            ) : (
                <form action={deleteSnippet} className="text-xl text-[var(--forground-buttons2)]">
                    <Link href={"/snippet/edit/" + entry.id} title="Edit snippet">
                        Edit
                    </Link>
                    <DeleteButton />
                    <input type="hidden" value={entry.id} name="id" id="id"></input>
                    <input type="hidden" value="browse" name="currentPage" id="currentPage"></input>
                </form>
            )}
        </div>
    );
}
