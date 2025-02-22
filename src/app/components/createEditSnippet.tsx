"use client";
// import SyntaxHighligher from "react-syntax-highlighter"
// import { agate as dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useState } from "react";
import { renpyfilesTable, renpyTable } from "@/db/schema";
import { useFormStatus } from "react-dom";
import CodePlace from "./fileViewer";

const maxDescriptionLength = 450;

export default function CreateOrEditSnippet(props: {
    form_action: (files: (typeof renpyfilesTable.$inferSelect)[], formData: FormData) => Promise<void>;
    entry_files: (typeof renpyfilesTable.$inferSelect)[];
    entry?: typeof renpyTable.$inferSelect;
    editing?: boolean;
}) {
    /*
    TODO: For addtional tags, we should add a ? button that when you hover will tell you all the things, "Addtional index for search", "You can enter multiple tags by seperating them with commas"
    TODO: Throw some logic at the input for changing the file name, so it matches the size of the text, that way, it doesn't grow or shrink the tab
    */
    const [files, setFiles] = useState(props.entry_files);
    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
    const formActionWithFiles = props.form_action.bind(null, files);
    const descriptionUpdate = function (x: HTMLTextAreaElement) {
        if (x.value.length > maxDescriptionLength) {
            setDescriptionErrorMessage("Description is too long. (" + x.value.length + "/"+maxDescriptionLength + ")");
        } else {
            setDescriptionErrorMessage("");
        }
    };
    return (
        <form action={formActionWithFiles} id="createViewForm">
            <input type="hidden" name="id" id="id" value={props.entry?.id}></input>
            <h1 className="text-2xl text-[var(--layout-bar-selected)] pb-4 pt-2">
                {props.editing ? "Create Snippet" : "Editing Snippet"}
            </h1>
            <div
                className="grid grid-rows-6 w-[40rem] gap-x-4 gap-y-1 inputForm pl-3"
                style={{ gridTemplateColumns: "max-content auto" }}
            >
                <label htmlFor="title">Title</label>
                <input
                    className="stanInput"
                    type="text"
                    name="title"
                    id="title"
                    required
                    defaultValue={props.entry?.title}
                ></input>

                <label htmlFor="author">Author</label>
                <input
                    className="stanInput"
                    type="text"
                    name="author"
                    id="author"
                    defaultValue={props.entry?.author || ""}
                ></input>

                <label htmlFor="catagory">Catagory</label>
                <input
                    className="stanInput"
                    type="text"
                    name="catagory"
                    id="catagory"
                    defaultValue={props.entry?.catagory || ""}
                ></input>

                <label htmlFor="tags">Search Tags</label>
                <input
                    className="stanInput"
                    type="text"
                    name="tags"
                    id="tags"
                    placeholder="Use commas to enter multiple tags"
                    defaultValue={props.entry?.tags || ""}
                ></input>

                <label htmlFor="description">Description</label>
                <div className=" row-span-2">
                    <textarea
                        className="stanInput resize-none w-full h-full"
                        name="description"
                        id="description"
                        defaultValue={props.entry?.description || ""}
                        placeholder={`Enter up to ${maxDescriptionLength} characters`}
                        onChange={(e) => descriptionUpdate(e.currentTarget)}
                    ></textarea>
                </div>
            </div>
            <div className="text-red-500 text-2xl translate-x-[10.2rem] pb-4">{descriptionErrorMessage}</div>
            <CodePlace files={files} setFiles={setFiles}></CodePlace>
            <SubmitButton editMode={props.editing} disable={descriptionErrorMessage != ""} />
        </form>
    );
}

function SubmitButton(props: { editMode?: boolean; disable?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending || props.disable}
            className={
                "disabled:text-black text-[var(--forground-buttons2)] text-2xl " +
                "-translate-y-9 " +
                " border-2 rounded-lg border-[var(--forground-buttons2)] disabled:border-black p-1 " +
                (pending || props.disable ? "" : "hover")
            }
        >
            {pending ? "Uploading" : props.editMode ? "Create" : "Submit Changes"}
        </button>
    );
}
