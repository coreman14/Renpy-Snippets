import { db, renpyTable } from "@/db/schema";
import { cookies } from 'next/headers'
import BrowsePage from "./browsePage";
import { desc } from "drizzle-orm";

export default async function BrowsePageServer() {
    const userId = (await cookies()).get("userId")?.value;
    const data = await db.select().from(renpyTable).orderBy(desc(renpyTable.mdate));
    return <BrowsePage userId={userId} pageEntries={data} dateOfCall={new Date().getTime()}/>
  }
  