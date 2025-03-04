import {renpyFileDefaultNewFile } from "@/db/schema";
import CreateOrEditSnippet from '@/app/components/createEditSnippet';
import { createSnippet } from '@/app/api';
export default async function EditEntry() {
  const entry_files = [renpyFileDefaultNewFile]
  entry_files[0].filename = "NewFile.rpy"
  return <CreateOrEditSnippet entry_files={entry_files} form_action={createSnippet} editing={true}></CreateOrEditSnippet>

}
