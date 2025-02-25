'use client';
import { useFormStatus } from "react-dom";

export function DeleteButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className={"disabled:text-black pl-2 " + (pending ? "" : "hover")} title="Delete Snippet">
            Delete
        </button>
    );
}
