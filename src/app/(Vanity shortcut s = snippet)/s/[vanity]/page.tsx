import SnippetView from "@/app/components/showSnippet";
import { renpyTable, db, renpyfilesTable, vanityLink } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
export default async function ViewSnippetVanityLink(props: {
  params: Promise<{ vanity: string }>;
}) {
  const params = await props.params;
  const vanity = params.vanity;
  const id = (await db.select().from(vanityLink).where(eq(vanityLink.url, vanity)))[0].snippet_id
  const [entry, entry_files] = await Promise.all([
    db.select().from(renpyTable).where(eq(renpyTable.id, id)),
    db.select().from(renpyfilesTable).where(eq(renpyfilesTable.snippet_id, id))
  ])
  const userId = (await cookies()).get("userId")?.value;
  return <SnippetView entry={entry} entry_files={entry_files} userId={userId} vanity={vanity}></SnippetView>

}
