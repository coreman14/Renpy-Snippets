"use client";
// import SyntaxHighligher from "react-syntax-highlighter"
// import { agate as dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useActionState, useEffect, useRef, useState } from "react";
import { renpyfilesTable, renpyTable } from "@/db/schema";
import { useFormStatus } from "react-dom";
import CodePlace from "./fileViewer";
import { blankLine } from "../utils/definitions";
import Image from "next/image";
import { formatVanityURLPath } from "../utils/formValidation";

const maxDescriptionLength = 450;


const initialState = {
    message: '',
    title: '',
    author: '',
    catagory: '',
    tags: '',
    description: '',
  }

export default function CreateOrEditSnippet(props: {
    form_action: (state: void) => Promise<void> | void;
    entry_files: (typeof renpyfilesTable.$inferSelect)[];
    entry?: typeof renpyTable.$inferSelect;
    editing?: boolean;
    vanity?: string;
}) {
    const [files, setFiles] = useState(props.entry_files);
    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState(blankLine);
    const [vanityIsClicked, setVanityIsClicked] = useState(false);
    const [vanity, setVanity] = useState(props.vanity || "");
    const authorRef = useRef<HTMLInputElement>(null);
    const [state, formAction, pending] = useActionState(props.form_action, initialState)
    const descriptionUpdate = function (x: HTMLTextAreaElement) {
        if (x.value.length > maxDescriptionLength) {
            setDescriptionErrorMessage(
                "Description is too long. (" + x.value.length + "/" + maxDescriptionLength + ")"
            );
        } else {
            setDescriptionErrorMessage(blankLine);
        }
    };
    const updateUserStroage = () => {
        localStorage.setItem("authorName", authorRef.current?.value || "");
    };

    useEffect(() => {
        if (authorRef.current) {
            authorRef.current.value =
                props.entry?.author ||
                (localStorage.getItem("authorName") ? localStorage.getItem("authorName") || "" : "");
        }
        if ('title' in state && state.title != '' && !vanityIsClicked){
            setVanityIsClicked(true);
        }
    }, [state]);
    return (
        <form action={formAction} id="createViewForm">
            <input type="hidden" name="id" id="id" value={props.entry?.id}></input>
            <input type="hidden" name="files" id="files" value={JSON.stringify(files)}></input>
            <h1 className="text-2xl text-[var(--layout-bar-selected)] pb-4 pt-2">
                {props.editing ? "Create Snippet" : "Editing Snippet"}
            </h1>
            <div
                className="grid grid-rows-7 w-[50%] gap-x-4 gap-y-1 inputForm pl-3"
                style={{ gridTemplateColumns: "max-content auto" }}
            >
                <label htmlFor="title">Title</label>
                <input
                    className="stanInput"
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Title (Required)"
                    required
                    defaultValue={state.title || props.entry?.title}
                ></input>

                <label htmlFor="author">Author</label>
                <input
                    className="stanInput"
                    type="text"
                    name="author"
                    id="author"
                    placeholder="Author"
                    defaultValue={state.author ||props.entry?.author || ""}
                    ref={authorRef}
                ></input>

                <label htmlFor="catagory">Catagory</label>
                <input
                    className="stanInput"
                    type="text"
                    name="catagory"
                    id="catagory"
                    placeholder="Catagory"
                    defaultValue={state.catagory || props.entry?.catagory || ""}
                ></input>

                <label htmlFor="vanity">
                    <Image
                        className="inline-block invert-100 pr-1 align-baseline"
                        src="/question.svg"
                        alt="Qustion Mark"
                        width={22}
                        height={22}
                        title="A string of characters that can be used to directly access this snippet. You can use this url by adding the string after '/s/'"
                    />
                    Shortcut link
                </label>
                <div className="overflow-x-visible whitespace-nowrap">
                    <input
                        className={"stanInput h-[100%] w-[100%] " + (state.message ? "border-[var(--error-text)]!" : "")}
                        type="text"
                        name="vanity"
                        id="vanity"
                        placeholder="Vanity Link"
                        defaultValue={vanity || props.vanity ||  ""}
                        onFocus={() => setVanityIsClicked(true)}
                        onBlur={() => setVanityIsClicked(false)}
                        onChange={(e) => {setVanity(e.target.value); state.message = ""}}
                    ></input>
                    {vanityIsClicked && (
                        <span className="pl-2 w-fit">
                            
                            <span className={"" + (vanity && !state.message ? "text-[var(--correct-text)]" : "text-[var(--error-text)]")}>
                                {state.message || (vanity && "Shortcut url: " + "/s/" + (formatVanityURLPath(vanity || ""))) || ""}
                                
                            </span>
                        </span>
                    )}
                </div>
                <label htmlFor="tags">
                    <Image
                        className="inline-block invert-100 pr-1 align-baseline"
                        src="/question.svg"
                        alt="Qustion Mark"
                        width={22}
                        height={22}
                        title="Additional search and filter indexes. Treat these tags as keywords you may use to find this entry later. You can assign multiple tags by seperating them with commas"
                    />
                    Search Tags
                </label>
                <input
                    className="stanInput"
                    type="text"
                    name="tags"
                    id="tags"
                    placeholder="Use commas to enter multiple tags"
                    defaultValue={state.tags || props.entry?.tags || ""}
                ></input>

                <label htmlFor="description">Description</label>
                <div className=" row-span-2">
                    <textarea
                        className="stanInput resize-none w-full h-full"
                        name="description"
                        id="description"
                        defaultValue={state.description || props.entry?.description || ""}
                        placeholder={`Enter up to ${maxDescriptionLength} characters`}
                        onChange={(e) => descriptionUpdate(e.currentTarget)}
                    ></textarea>
                </div>
            </div>
            <div className="text-[var(--error-text)] text-2xl translate-x-[10.2rem] pb-1 max-w-fit">{descriptionErrorMessage}</div>
            <CodePlace files={files} setFiles={setFiles}></CodePlace>
            <SubmitButton
                editMode={props.editing}
                disable={pending || descriptionErrorMessage != blankLine}
                beforeSubmit={updateUserStroage}
            />
        </form>
    );
}

function SubmitButton(props: { editMode?: boolean; disable?: boolean; beforeSubmit?: () => void }) {
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
            title={pending ? "Uploading" : props.disable ? "Please fix submission before submitting" : "Submit form"}
            onClick={props.beforeSubmit}
        >
            {pending ? "Uploading" : props.editMode ? "Create" : "Submit Changes"}
        </button>
    );
}
