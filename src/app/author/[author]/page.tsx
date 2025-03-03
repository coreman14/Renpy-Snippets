import { authorAdvancedSearch } from "@/db/schema";
import { cookies } from "next/headers";
import BaseBrowsePage from "@/app/components/ListEntries";

export default async function AuthorPageServer(props: { params: Promise<{ author: string }> }) {
    const params = await props.params;
    const authorName = decodeURIComponent(params.author);
    const data = await authorAdvancedSearch(authorName);

    const userId = (await cookies()).get("userId")?.value;
    return <BaseBrowsePage userId={userId} pageEntries={data} title={'Snippets from "' + authorName + '"'} />;
}
/*

  */
