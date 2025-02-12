import { db, renpyTable } from "@/db/schema";
import { cookies } from 'next/headers'
import BrowsePage from "./browsePage";
export default async function BrowsePageServer() {
    const userId = (await cookies()).get("userId")?.value;
    const data = await db.select().from(renpyTable);
    return <BrowsePage userId={userId} pageEntries={data}/>
  }
  