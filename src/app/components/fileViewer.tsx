"use client";

import { renpyFileDefaultNewFile, renpyfilesTable } from "@/db/schema";
import { useRef, useState, KeyboardEvent, Dispatch, useEffect } from "react";

//Light syntax cause I can't get it to not rerender
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula as darkTheme, nnfx as lightTheme } from "react-syntax-highlighter/dist/esm/styles/hljs";
import renpy from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
SyntaxHighlighter.registerLanguage("renpy", renpy);

export default function CodePlace(props: {
    files: (typeof renpyfilesTable.$inferSelect)[];
    setFiles?: Dispatch<(typeof renpyfilesTable.$inferSelect)[]>;
}) {
    if (props.setFiles) {
        return <EditCodePlace files={props.files} setFiles={props.setFiles}></EditCodePlace>;
    } else {
        return <ViewCodePlace files={props.files}></ViewCodePlace>;
    }
}

function EditCodePlace(props: {
    files: (typeof renpyfilesTable.$inferSelect)[];
    setFiles: Dispatch<(typeof renpyfilesTable.$inferSelect)[]>;
}) {
    const files = props.files;
    const setFiles = props.setFiles;

    const [currentTab, setCurrentTab] = useState(0);
    const [editfileName, setEditfileName] = useState(false);
    const [indentSize, setIndentSize] = useState(4);
    const textField = useRef<HTMLTextAreaElement>(null);
    const updateCode = function (x: string, ind: number) {
        const newFiles = [...files];
        newFiles[ind].code = x;
        newFiles[ind].mdate = new Date().getTime();

        setFiles(newFiles);
    };
    const createNewFile = function () {
        setEditfileName(false);
        const newObject = structuredClone(renpyFileDefaultNewFile);
        let file_name = files.filter((x) => x.cdate != -1).length;
        newObject.filename = file_name + ".rpy";
        while (files.map((x) => x.filename).includes(newObject.filename)) {
            file_name++;
            newObject.filename = file_name + ".rpy";
        }
        newObject.code = "" + file_name;
        setFiles(files.concat(newObject));
        setCurrentTab(files.length);
    };
    const editFileName = function (new_name: string, ind: number) {
        const file = files[ind];
        file.filename = new_name;
        setFiles(files.concat());
    };
    const removeFile = function (ind: number) {
        if (currentTab == ind) {
            setCurrentTab(0);
        } else {
            console.log("Did not delete current tab");
            setCurrentTab(Math.max(ind - 1, 0));
        }
        if (files[ind].id != -1) {
            console.log("File is set to be deleted");
            //If the file is linked to the DB
            files[ind].cdate = -1; //Dont show in the file system
            files[ind].snippet_id = -1; //Remove from db
            setFiles(files.concat());
        } else {
            console.log("File is deleted");
            console.log(files.filter((x) => x != files[ind]));
            //If not, we can just delete it
            setFiles(files.filter((x) => x != files[ind]));
        }
    };
    const vscodeFeatures = function (e: KeyboardEvent<HTMLTextAreaElement>) {
        const ele = e.currentTarget;
        const text = ele.value.split("\n");
        const position = ele.selectionStart;
        //Get the current line
        const row = ele.value.substring(0, position).split("\n").length - 1;
        if (e.key.includes("Enter")) {
            //Get position in current line
            const newPosition = position - ele.value.substring(0, position).lastIndexOf("\n") - 2;
            //Calculate indent
            const indent = text[row].length - text[row].trimStart().length;
            let indentToAdd;
            if (text[row].charAt(newPosition) == ":") {
                indentToAdd = indentSize;
                const newrow = text[row].split(":", 2);
                newrow[0] += ":\n";
                newrow[1] = " ".repeat(indent + indentToAdd) + newrow[1];
                text[row] = newrow.join("");
            } else {
                indentToAdd = 0;
                const newrow = [text[row].substring(0, newPosition + 1), text[row].substring(newPosition + 1)];
                newrow[0] += "\n";
                newrow[1] = " ".repeat(indent) + newrow[1];
                text[row] = newrow.join("");
            }
            ele.value = text.join("\n");
            ele.setSelectionRange(position + indent + indentToAdd + 1, position + indent + indentToAdd + 1);
        } else {
            if (e.shiftKey) {
                //Calculate indent
                let indent = Math.max(text[row].length - text[row].trimStart().length, 0);
                const old_indent = indent;
                while (indent % indentSize != 0) {
                    //Start indent from a multiple of identsize
                    indent += 1;
                }
                indent = Math.max(indent - indentSize, 0);
                text[row] = text[row].replace(/^ +/, " ".repeat(indent));
                ele.value = text.join("\n");
                ele.setSelectionRange(position - (old_indent - indent), position - (old_indent - indent), "none");
            } else {
                const newPosition = position - ele.value.substring(0, position).lastIndexOf("\n") - 2;
                const newrow = [text[row].substring(0, newPosition + 1), text[row].substring(newPosition + 1)];
                newrow[1] = " ".repeat(indentSize) + newrow[1];
                text[row] = newrow.join("");
                ele.value = text.join("\n");
                ele.setSelectionRange(position + indentSize, position + indentSize, "none");
            }
        }
        updateCode(ele.value, currentTab);
        ele.blur();
        ele.focus();
    };
    return (
        <>
            <div
                className="tab mb-1 overflow-x-auto overflow-y-hidden pt-1 pb-1 max-w-full flex"
                style={{ scrollbarWidth: "none" }}
                onWheel={(e) => {
                    if (e.deltaY) {
                        e.currentTarget.scrollLeft += e.deltaY;
                    }
                }}
            >
                {props.files.map((x, ind) =>
                    x.cdate == -1 ? (
                        ""
                    ) : editfileName && ind == currentTab ? (
                        <input
                            key={ind}
                            autoFocus
                            className="tablinks border-2 rounded-lg border-[var(--forground-buttons)] "
                            value={x.filename}
                            onInput={(e) => editFileName(e.currentTarget.value, ind)}
                            onBlur={() => setEditfileName(false)}
                            onKeyDown={(e) => {
                                if (e.key == "Escape") {
                                    setEditfileName(false);
                                } else if (e.key == "Enter" || e.key == "NumpadEnter") {
                                    e.preventDefault();
                                    setEditfileName(false);
                                }
                            }}
                            title="Update file name"
                        />
                    ) : (
                        <span
                            key={ind}
                            className={
                                "p-1 mr-1 text-xl border-2 rounded-lg " +
                                (ind == currentTab
                                    ? "text-[var(--forground-buttons)] border-[var(--forground-buttons)] "
                                    : "")
                            }
                            onDoubleClick={() => {
                                setEditfileName((a) => !a);
                            }}
                            onClick={() => {
                                setEditfileName(false);
                                setCurrentTab(ind);
                            }}
                            title={ind == currentTab ? "" : `Switch to "${x.filename}"`}
                        >
                            <span className={ind == currentTab ? "" : "hover"} title={ind == currentTab ? "Double click to edit" : `Switch to "${x.filename}"`}>
                                {x.filename}
                            </span>
                            {files.filter((x) => x.cdate != -1).length > 1 && (
                                <span
                                    onClick={() => removeFile(ind)}
                                    className="p-1 text-[var(--forground-buttons2)] hover"
                                    title={`Delete "${x.filename}"`}
                                >
                                    x
                                </span>
                            )}
                        </span>
                    )
                )}
                <span
                    key="newTab"
                    className="tablinks text-xl text-[var(--forground-buttons2)] border-2 rounded-md p-1 hover border-[var(--forground-buttons2)]"
                    onClick={createNewFile}
                    title="Create new file"
                >
                    +
                </span>
            </div>
            <div>
                <textarea
                    id="mainnnnnnnnnn"
                    ref={textField}
                    rows={16}
                    cols={900}
                    className="codePlace pl-[0.5rem] resize-none max-w-full"
                    value={files[currentTab].code}
                    onInput={(e) => {
                        updateCode(e.currentTarget.value, currentTab);
                    }}
                    onKeyDown={(e) => {
                        if (
                            (e.key == "Tab" || e.key == "Enter" || e.key == "NumpadEnter") &&
                            e.currentTarget.selectionStart == e.currentTarget.selectionEnd //Don't do this if text is selected
                        ) {
                            e.preventDefault();
                            vscodeFeatures(e);
                        } else if (e.key == "Escape") {
                            e.currentTarget.blur();
                        }
                    }}
                ></textarea>
                <div className="flex flex-1 justify-end">
                    <div></div>
                    <div className="text-2xl" title="Set the number of spaces to use when pressing tab and enter">
                        <label htmlFor="indentSize">Indent Size</label>
                        <input
                            id="indentSize"
                            className="ml-2 w-12 outline-hidden border-2 border-[var(--background)] focus:border-red-500 rounded-md pl-1 stanInput"
                            type="number"
                            value={indentSize}
                            onInput={(e) => {
                                if (e.currentTarget.value) {
                                    setIndentSize(Math.max(parseInt(e.currentTarget.value || ""), 1));
                                } else {
                                    setIndentSize(1);
                                }
                            }}
                        ></input>
                    </div>
                </div>
            </div>
        </>
    );
}

function ViewCodePlace(props: { files: (typeof renpyfilesTable.$inferSelect)[] }) {
    const searchParams = useSearchParams();
    const router = useRouter()
    const pathname = usePathname()

    const [currentTab, setCurrentTab] = useState(Math.max(parseInt(searchParams.get("file") || "1") - 1, 0));
    let darkModeTheme = true;
    if (typeof window !== "undefined") {
        darkModeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    useEffect(() => {
        const nextSearchParams = new URLSearchParams(searchParams.toString())
        if (nextSearchParams.has("file")){
            nextSearchParams.delete('file')
            router.replace(`${pathname}?${nextSearchParams}`)
        }
    });
    const maxWidth = "98vw";
    const codeTabs = props.files.map((x, ind) => (
        <SyntaxHighlighter
            key={ind}
            customStyle={{ maxWidth: "98vw", maxHeight: "60vh" }}
            language="renpy"
            style={darkModeTheme ? darkTheme : lightTheme}
            showLineNumbers={true}
        >
            {x.code}
        </SyntaxHighlighter>
    ));
    return (
        <>
            <div
                className="tab mb-1 overflow-x-auto overflow-y-hidden pt-1 pb-1"
                style={{ scrollbarWidth: "none", maxWidth: maxWidth }}
                onWheel={(e) => {
                    if (e.deltaY) {
                        e.currentTarget.scrollLeft += e.deltaY;
                    }
                }}
            >
                {props.files.map((x, ind) =>
                    x.cdate == -1 ? (
                        ""
                    ) : (
                        <span
                            key={ind}
                            className={
                                "p-1 mr-1 text-xl border-2 rounded-lg " +
                                (ind == currentTab
                                    ? "text-[var(--forground-buttons)] border-[var(--forground-buttons)] pointer-events-none"
                                    : "hover")
                            }
                            title={currentTab == ind ? "" : `Switch to file ${x.filename}`}
                        >
                            <span
                                className={"tablinks" + (currentTab == ind ? "" : " ")}
                                onClick={() => {
                                    setCurrentTab(ind);
                                }}
                            >
                                {x.filename}
                            </span>
                        </span>
                    )
                )}
            </div>
            <div id="codediv">
                {props.files.map((x, ind) => (ind == currentTab ? <div key={ind}>{codeTabs[ind]}</div> : ""))}
            </div>
        </>
    );
}
