'use client'

import { useState } from "react"
import { redirect } from "next/navigation";

export default function SearchBar(){
    const [search, setSearch] = useState("")

    return <input type="text" value={search} onInput={(e) => setSearch(e.currentTarget.value)} className="text-red-500" style={{"direction" : "ltr"}}
    onKeyDown={(e) => {if (e.key.includes("Enter") && e.currentTarget.value != ""){
        redirect("/browse?searchTerm=" + search)
    }}}
    ></input>


}