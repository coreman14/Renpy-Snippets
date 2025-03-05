'use client';
import { useFormStatus } from "react-dom";

export function DeleteButton(props: {underline?: boolean}) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className={"disabled:text-black pl-2 " + (pending ? "" : "hover") + " " + (props.underline ? "underline": "")} title="Delete Snippet">
            Delete
        </button>
    );
}
