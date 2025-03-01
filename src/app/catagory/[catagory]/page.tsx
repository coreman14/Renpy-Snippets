import { catagoryAdvancedSearch } from "@/db/schema";
import { cookies } from "next/headers";
import AuthorPage from "./CatagoryPage";

export default async function CatagoryPageServer(props: { params: Promise<{ catagory: string }> }) {
    const params = await props.params;
    let catagoryName = decodeURIComponent(params.catagory);
    // const data = await browseSimpleSearch(typeof searchString === "string" ? searchString : searchString[0]);
    const data = await catagoryAdvancedSearch(catagoryName);
    catagoryName = catagoryName.trim().split(" ").map((word) => {
      return (word[0]?.toUpperCase() || " ") + word.substring(1);
    }).join(" ");
    const userId = (await cookies()).get("userId")?.value;
    return <AuthorPage userId={userId} pageEntries={data} catagory={catagoryName} />;
}
/*

  */
