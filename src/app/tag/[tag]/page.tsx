import { tagAdvancedSearch } from "@/db/schema";
import { cookies } from "next/headers";
import TagPage from "./TagPage";

export default async function TagPageServer(props: { params: Promise<{ tag: string }> }) {
    const params = await props.params;
    let tagName = decodeURIComponent(params.tag);
    // const data = await browseSimpleSearch(typeof searchString === "string" ? searchString : searchString[0]);
    const data = await tagAdvancedSearch(tagName);
    tagName = tagName.trim().split(" ").map((word) => { 
      return (word[0]?.toUpperCase() || " ") + word.substring(1); 
    }).join(" ");
    const userId = (await cookies()).get("userId")?.value;
    return <TagPage userId={userId} pageEntries={data} tag={tagName} />;
}
/*

  */
