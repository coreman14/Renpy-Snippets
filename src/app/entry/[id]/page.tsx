import { renpyTable, db, renpyfilesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import BrowseView from "./show_entry";
export default async function ViewEntry(props: {
  params: Promise<{ id: number }>;
}) {
  const params = await props.params;
  const id = params.id;
  const [entry, entry_files] = await Promise.all([
    db.select().from(renpyTable).where(eq(renpyTable.id, id)),
    db.select().from(renpyfilesTable).where(eq(renpyfilesTable.snippet_id, id))
  ])

  return <BrowseView entry={entry} entry_files={entry_files}></BrowseView>

}
