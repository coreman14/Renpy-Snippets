import SnippetView from "@/app/components/showSnippet";
import { renpyTable, db, renpyfilesTable, vanityLink } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import type { Metadata } from 'next'
import { base_metadata } from "@/app/utils/baseMetaData";
 
type Props = {
  params: Promise<{ vanity: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params }: Props): Promise<Metadata> {
  // read route params
  const { vanity } = await params
 
  const id = (await db.select().from(vanityLink).where(eq(vanityLink.url, vanity)))[0]?.snippet_id || -1
  const entry = await db.select().from(renpyTable).where(eq(renpyTable.id, id))
  
  if (entry){
    return {
      title: entry[0].title,
      description: entry[0].description
    }
  }
  return base_metadata;
}

export default async function ViewSnippetVanityLink(props: Props) {
  const params = await props.params;
  const vanity = params.vanity;
  const id = (await db.select().from(vanityLink).where(eq(vanityLink.url, vanity)))[0]?.snippet_id || -1
  const [entry, entry_files] = await Promise.all([
    db.select().from(renpyTable).where(eq(renpyTable.id, id)),
    db.select().from(renpyfilesTable).where(eq(renpyfilesTable.snippet_id, id))
  ])
  const userId = (await cookies()).get("userId")?.value;
  return <SnippetView entry={entry} entry_files={entry_files} userId={userId} vanity={vanity}></SnippetView>

}
