import { authorAdvancedSearch } from "@/db/schema";
import { cookies } from "next/headers";
import AuthorPage from "./AuthorPage";

export default async function AuthorPageServer(props: { params: Promise<{ author: string }> }) {
    const params = await props.params;
    const authorName = decodeURIComponent(params.author);
    // const data = await browseSimpleSearch(typeof searchString === "string" ? searchString : searchString[0]);
    const data = await authorAdvancedSearch(authorName);

    const userId = (await cookies()).get("userId")?.value;
    return <AuthorPage userId={userId} pageEntries={data} author={authorName} />;
}
/*

  */
