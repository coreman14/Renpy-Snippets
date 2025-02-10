import { cookies } from 'next/headers'
import { renpyTable, db, renpyfilesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import EditSnippet from "./edit_page";
import { redirect } from 'next/navigation';
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
  return <EditSnippet entry={entry[0]} entry_files={entry_files}/>

}
