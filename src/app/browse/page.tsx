import { browseAdvancedSearch } from "@/db/schema";
import { cookies } from 'next/headers'
import BrowsePage from "./browsePage";
export const dynamic = 'force-dynamic'
export default async function BrowsePageServer({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    let searchString = (await searchParams).searchTerm
    if (!searchString){
      searchString = ""
    }
    // const data = await browseSimpleSearch(typeof searchString === "string" ? searchString : searchString[0]);
    const data = await browseAdvancedSearch(typeof searchString === "string" ? searchString : searchString[0]);


    const userId = (await cookies()).get("userId")?.value;
    return <BrowsePage userId={userId} pageEntries={data}/>
  }
  /*

  */