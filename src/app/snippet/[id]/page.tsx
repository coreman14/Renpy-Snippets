import { renpyTable, db, renpyfilesTable, vanityLink } from "@/db/schema";
import { eq } from "drizzle-orm";
import SnippetView from "../../components/showSnippet";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { base_metadata } from "@/app/utils/baseMetaData";

type Props = {
  params: Promise<{ id: number }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params }: Props): Promise<Metadata> {
  // read route params
  const { id } = await params
 
  const entry = await db.select().from(renpyTable).where(eq(renpyTable.id, id))
  
  if (entry){
    return {
      title: entry[0].title,
      description: entry[0].description
    }
  }
  return base_metadata;
}


export default async function ViewEntry(props: {
  params: Promise<{ id: number }>;
}) {
  const params = await props.params;
  const id = params.id;
  const [entry, entry_files, vanity] = await Promise.all([
    db.select().from(renpyTable).where(eq(renpyTable.id, id)),
    db.select().from(renpyfilesTable).where(eq(renpyfilesTable.snippet_id, id)),
    db.select({vanity: vanityLink.url}).from(vanityLink).where(eq(vanityLink.snippet_id, id))
  ])
  const userId = (await cookies()).get("userId")?.value;
  return <SnippetView entry={entry} entry_files={entry_files} userId={userId} vanity={vanity[0]?.vanity}></SnippetView>

}
