import { tagAdvancedSearch } from "@/db/schema";
import { cookies } from "next/headers";
import BaseBrowsePage from "@/app/components/ListSnippetEntries";

export default async function TagPageServer(props: { params: Promise<{ tag: string }> }) {
    const params = await props.params;
    let tagName = decodeURIComponent(params.tag);
    const data = await tagAdvancedSearch(tagName);
    tagName = tagName.trim().split(" ").map((word) => { 
      return (word[0]?.toUpperCase() || " ") + word.substring(1); 
    }).join(" ");
    const userId = (await cookies()).get("userId")?.value;
    return <BaseBrowsePage userId={userId} pageEntries={data} title={'Snippets tagged "' + tagName + '"'} />;
}
/*

  */
