import { db, renpyTable } from "@/db/schema";
import { cookies } from 'next/headers'
import { desc } from "drizzle-orm";
import MostRecent from "./mostRecentList";

export default async function HomePage() {

    const data = await db.select().from(renpyTable).orderBy(desc(renpyTable.cdate));

    const userId = (await cookies()).get("userId")?.value;
    return <MostRecent userId={userId} pageEntries={data}/>
  }
  