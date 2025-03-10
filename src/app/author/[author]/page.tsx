import { authorAdvancedSearch } from "@/db/schema";
import { cookies } from "next/headers";
import BaseBrowsePage from "@/app/components/ListSnippetEntries";
import type { Metadata } from 'next'
 
type Props = {
  params: Promise<{ author: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params }: Props): Promise<Metadata> {
  // read route params
  const { author } = await params

  return {
    title: `Entries by "${author}"`,
    description: `See entries that were created by "${author}"`
  }
}
export default async function AuthorPageServer(props: Props) {
    const params = await props.params;
    const authorName = decodeURIComponent(params.author);
    const data = await authorAdvancedSearch(authorName);

    const userId = (await cookies()).get("userId")?.value;
    return <BaseBrowsePage userId={userId} pageEntries={data} title={'Snippets from "' + authorName + '"'} />;
}
/*

  */
