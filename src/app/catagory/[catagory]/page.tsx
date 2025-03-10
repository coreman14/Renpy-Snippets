import { catagoryAdvancedSearch } from "@/db/schema";
import { cookies } from "next/headers";
import BaseBrowsePage from "@/app/components/ListSnippetEntries";
import type { Metadata } from 'next'
 
type Props = {
  params: Promise<{ catagory: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params }: Props): Promise<Metadata> {
  // read route params
  const { catagory } = await params

  return {
    title: `Results for catagory "${catagory}"`,
    description: `See entries that are catagorized as "${catagory}"`
  }
}
export default async function CatagoryPageServer(props: Props) {
    const params = await props.params;
    let catagoryName = decodeURIComponent(params.catagory);
    const data = await catagoryAdvancedSearch(catagoryName);
    catagoryName = catagoryName.trim().split(" ").map((word) => {
      return (word[0]?.toUpperCase() || " ") + word.substring(1);
    }).join(" ");
    const userId = (await cookies()).get("userId")?.value;
    return <BaseBrowsePage userId={userId} pageEntries={data} title={'"' + catagoryName + '" Snippets'}/>;
}
/*

  */
