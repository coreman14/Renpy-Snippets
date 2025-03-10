import { tagAdvancedSearch } from "@/db/schema";
import { cookies } from "next/headers";
import BaseBrowsePage from "@/app/components/ListSnippetEntries";
import type { Metadata } from 'next'
 
type Props = {
  params: Promise<{ tag: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params }: Props): Promise<Metadata> {
  // read route params
  const { tag } = await params

  return {
    title: `Results for tag "${tag}"`,
    description: `See entries that are tagged with "${tag}"`
  }
}

export default async function TagPageServer(props: Props) {
    const params = await props.params;
    let tagName = decodeURIComponent(params.tag);
    const data = await tagAdvancedSearch(tagName);
    tagName = tagName.trim().split(" ").map((word) => { 
      return (word[0]?.toUpperCase() || " ") + word.substring(1); 
    }).join(" ");
    const userId = (await cookies()).get("userId")?.value;
    return <BaseBrowsePage userId={userId} pageEntries={data} title={'Snippets tagged "' + tagName + '"'} />;
}
/*

  */
