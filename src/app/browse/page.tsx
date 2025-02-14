import { browseSimpleSearch, db, renpyTable } from "@/db/schema";
import { cookies } from 'next/headers'
import BrowsePage from "./browsePage";
import { desc } from "drizzle-orm";

export default async function BrowsePageServer({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchString = (await searchParams).searchTerm
    let data;
    if (searchString){
      data = await browseSimpleSearch(typeof searchString === "string" ? searchString : searchString[0]);
    }
    else{
      data = await db.select().from(renpyTable).orderBy(desc(renpyTable.mdate));
    }
    const userId = (await cookies()).get("userId")?.value;
    return <BrowsePage userId={userId} pageEntries={data} dateOfCall={new Date().getTime()}/>
  }
  