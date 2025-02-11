import { cookies } from 'next/headers'
import { renpyTable, db, renpyfilesTable, renpyFileDefaultNewFile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from 'next/navigation';
import CreateOrEditSnippet from '@/app/components/createSnippet';
import { editSnippet } from '@/app/api';
export default async function ViewEntry(props: {
  params: Promise<{ id: number }>;
}) {
  const params = await props.params;
  const id = params.id;
  const [entry, entry_files] = await Promise.all([
    db.select().from(renpyTable).where(eq(renpyTable.id, id)),
    db.select().from(renpyfilesTable).where(eq(renpyfilesTable.snippet_id, id))
  ])
  if (entry[0].cookie_id != (await cookies()).get("userId")?.value){
    redirect("/browse")
  }
  return <CreateOrEditSnippet entry={entry[0]} entry_files={entry_files} default_file_object={renpyFileDefaultNewFile} form_action={editSnippet}></CreateOrEditSnippet>

}
