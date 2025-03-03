import { browseAdvancedSearch, numberOfSnippets, renpyTable } from "@/db/schema";
import { cookies } from 'next/headers'
import { desc } from "drizzle-orm";
import MostRecent from "./mostRecentList";
export const dynamic = 'force-dynamic'
export default async function HomePage() {

    const data = await browseAdvancedSearch("", desc(renpyTable.cdate), 6, 1);

    const userId = (await cookies()).get("userId")?.value;
    return <MostRecent userId={userId} pageEntries={data} showMoreSnippets={(await numberOfSnippets())[0].value > 6}/>
  }
  