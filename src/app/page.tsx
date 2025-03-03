import { homePageResults, numberOfSnippets } from "@/db/schema";
import { cookies } from 'next/headers'
import MostRecent from "./mostRecentList";
export const dynamic = 'force-dynamic'
export default async function HomePage() {

    const data = await homePageResults();

    const userId = (await cookies()).get("userId")?.value;
    return <MostRecent userId={userId} pageEntries={data} showMoreSnippets={(await numberOfSnippets())[0].value > 6}/>
  }
  