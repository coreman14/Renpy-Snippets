"use client";
// import SyntaxHighligher from "react-syntax-highlighter"
// import { agate as dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { KeyboardEvent, useRef, useState } from "react";
import { renpyFileDefaultNewFile, renpyfilesTable, renpyTable } from "@/db/schema";
import { useFormStatus } from "react-dom";

export default function CreateOrEditSnippet(props: {
    form_action: (files: (typeof renpyfilesTable.$inferSelect)[], formData: FormData) => Promise<void>;
    entry_files: (typeof renpyfilesTable.$inferSelect)[];
    entry?: typeof renpyTable.$inferSelect;
    editing?: boolean;
}) {
    //TODO: For addtional tags, we should add a ? button that when you hover will tell you all the things, "Addtional index for search", "You can enter multiple tags by seperating them with commas"
    const [files, setFiles] = useState(props.entry_files);
    const [currentTab, setCurrentTab] = useState(0);
    const [indentSize, setIndentSize] = useState(4);
    const [editfileName, setEditfileName] = useState(false);

    const lineNumber = useRef<HTMLTextAreaElement>(null);
    const formActionWithFiles = props.form_action.bind(null, files);
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
            setCurrentTab(Math.max(ind - 1, 0));
        }
        if (files[ind].id != -1) {
            //If the file is linked to the DB
            files[ind].cdate = -1; //Dont show in the file system
            files[ind].snippet_id = -1; //Remove from db
            setFiles(files.concat());
        } else {
            //If not, we can just delete it
            setFiles(files.filter((x) => x != files[ind]));
        }
    };
    const updateCode = function (x: string, ind: number) {
        const newFiles = [...files];
        newFiles[ind].code = x;
        newFiles[ind].mdate = new Date().getTime();

        setFiles(newFiles);
    };
    const autoScroll = function (scrollToMatch: number) {
        lineNumber.current!.scrollTo(0, scrollToMatch);
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
            //Tab might be a tad simpler
            /*
            Tab always adds `indentToAdd` spaces.
            Shift tab always removes `indentToAdd` spaces from the start of the line
            */
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
        ele.blur()
        ele.focus()
    };
    /*
  TODO: I want to add some comforts to the textarea incase the user chooses to write the code in it.
  The comforts are:
    Tab should insert 4 spaces/whatever is need to make the next multiple instead of changing focus, with shift-tab decreasing the spaces to a multiple of 4
    If enter is pressed right after a ":", we should insert 4 spaces/whatever is need to make the next multiple of 4.
  TODO: Throw some logic at the input for changing the file name, so it matches the size of the text, that way, it doesn't grow or shrink the tab
  */
    return (
        <form action={formActionWithFiles} className="text-cyan-500">
            <input type="hidden" name="id" id="id" value={props.entry?.id}></input>
            <h1>{props.editing ? "Create new snippet" : "Editing Snippet"}</h1>
            <br />
            <br />
            <div className="tab">
                {files.map((x, ind) =>
                    x.cdate == -1 ? (
                        ""
                    ) : (
                        <span key={ind}>
                            {editfileName && ind == currentTab ? (
                                <input
                                    autoFocus
                                    className="tablinks text-red-700"
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
                                ></input>
                            ) : (
                                <span
                                    className={"tablinks" + (currentTab == ind ? " text-red-700" : " ")}
                                    onClick={() => {
                                        setCurrentTab(ind);
                                        setEditfileName(false);
                                    }}
                                    onDoubleClick={() => setEditfileName((a) => !a)}
                                >
                                    {x.filename}
                                </span>
                            )}
                            {files.filter((x) => x.cdate != -1).length > 1 && (
                                <span onClick={() => removeFile(ind)}>x</span>
                            )}
                        </span>
                    )
                )}
                <span key="newTab" className="tablinks" onClick={() => createNewFile()}>
                    __++
                </span>
            </div>
            <div>
                <textarea
                    id="lineNumbers"
                    rows={10}
                    cols={1}
                    ref={lineNumber}
                    readOnly
                    inert
                    className="resize-none absolute bg-black text-white text-right pr-1"
                    value={
                        Array(files[currentTab].code.split("\n").length)
                            .fill(0)
                            .map((_, n) => n + 1 + "\n")
                            .join("") + ""
                    }
                ></textarea>
                <textarea
                    rows={10}
                    cols={50}
                    className="codePlace pl-8"
                    value={files[currentTab].code}
                    onInput={(e) => {
                        updateCode(e.currentTarget.value, currentTab);
                    }}
                    onScroll={(e) => autoScroll(e.currentTarget.scrollTop)}
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
                    //TODO: We add the key handler here for doing indenting on tab and enter and making sure esc blurs the element
                ></textarea>
                {/* <SyntaxHighligher language="renpy" style={dracula}>{files[currentTab].code}</SyntaxHighligher> */}
                {/*TODO: We are gonna ignore the syntax highlighting for now as it's not as seemless as I wanted it to be. Lets get the app working so visual can come later */}
            </div>
            <label htmlFor="indentSize">Size of indent: </label>
            <input
                type="number"
                value={indentSize}
                onInput={(e) => {
                    if (e.currentTarget.value){
                        setIndentSize(Math.max(parseInt(e.currentTarget.value || ""), 1));
                    }
                    else{
                        setIndentSize(1)
                    }
                }}
            ></input>
            <br />
            <br />
            <label htmlFor="title">Title: </label>
            <input type="text" name="title" id="title" required defaultValue={props.entry?.title}></input>
            <br />
            <br />
            <label htmlFor="author">Author: </label>
            <input type="text" name="author" id="author" defaultValue={props.entry?.author || ""}></input>
            <br />
            <br />

            <label htmlFor="catagory">Catagory: </label>
            <input type="text" name="catagory" id="catagory" defaultValue={props.entry?.catagory || ""}></input>
            <br />
            <br />
            <label htmlFor="tags">Additional Tags: </label>
            <input
                type="text"
                name="tags"
                id="tags"
                placeholder="Use commas to enter multiple tags"
                defaultValue={props.entry?.tags || ""}
            ></input>
            <br />
            <br />
            <label htmlFor="description">Description: </label>
            <textarea name="description" id="description" defaultValue={props.entry?.description || ""}></textarea>
            <br />
            <br />
            <SubmitButton editMode={props.editing} />
        </form>
    );
}

function SubmitButton(props: { editMode?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="disabled:text-black">
            {pending ? "Uploading" : props.editMode ? "Create" : "Submit Changes"}
        </button>
    );
}
