import { browseSimpleSearch, browseAdvancedSearchGrouped, browseCodeSearch } from "@/db/schema";
import { cookies } from 'next/headers'
import BaseBrowsePage from "../components/ListSnippetEntries";
export const dynamic = 'force-dynamic'
export default async function BrowsePageServer({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    let searchString = (await searchParams).searchTerm
    let searchCode = (await searchParams).searchCode
    if (!searchString){
      searchString = ""
    }
    if (!searchCode){
      searchCode = ""
    }
    let data: browseAdvancedSearchGrouped[] = [];
    if (searchCode){
      data = await browseCodeSearch(typeof searchCode === "string" ? searchCode : searchCode[0]);
    }
    else {
      data = await browseSimpleSearch(typeof searchString === "string" ? searchString : searchString[0]);
    }


    const userId = (await cookies()).get("userId")?.value;
    return <BaseBrowsePage userId={userId} pageEntries={data} title={searchString ? `Results for "${searchString}"` :  searchCode ? `Results for "${searchCode}"` : "Browse All"}/>
  }
  /*

  */