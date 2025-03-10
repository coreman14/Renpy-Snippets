import {renpyFileDefaultNewFile } from "@/db/schema";
import CreateOrEditSnippet from '@/app/components/createEditSnippet';

export default async function CreateNewEntry() {
  const entry_files = [renpyFileDefaultNewFile]
  entry_files[0].filename = "NewFile.rpy"
  return <CreateOrEditSnippet entry_files={entry_files} new_snippet={true}></CreateOrEditSnippet>

}
