import { cookies } from 'next/headers'
import { renpyTable, db, renpyfilesTable, vanityLink } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from 'next/navigation';
import CreateOrEditSnippet from '@/app/components/createEditSnippet';
import { editSnippet } from '@/app/api';
export default async function ViewEntry(props: {
  params: Promise<{ id: number }>;
}) {
  const params = await props.params;
  const id = params.id;
  const [entry, entry_files, vanity]  = await Promise.all([
    db.select().from(renpyTable).where(eq(renpyTable.id, id)),
    db.select().from(renpyfilesTable).where(eq(renpyfilesTable.snippet_id, id)),
    db.select({vanity: vanityLink.url}).from(vanityLink).where(eq(vanityLink.snippet_id, id))
  ])
  if (entry[0].cookie_id != (await cookies()).get("userId")?.value){
    redirect("/browse")
  }
  return <CreateOrEditSnippet entry={entry[0]} entry_files={entry_files} form_action={editSnippet} vanity={vanity[0]?.vanity}></CreateOrEditSnippet>

}
