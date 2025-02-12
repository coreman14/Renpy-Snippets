import {renpyFileDefaultNewFile } from "@/db/schema";
import CreateOrEditSnippet from '@/app/components/createSnippet';
import { createSnippet } from '@/app/api';
export default async function ViewEntry() {
  const entry_files = [renpyFileDefaultNewFile]
  entry_files[0].filename = "NewFile.rpy"
  return <CreateOrEditSnippet entry_files={entry_files} form_action={createSnippet}></CreateOrEditSnippet>

}
