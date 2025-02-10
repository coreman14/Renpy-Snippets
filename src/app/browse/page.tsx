import Link from "next/link";
import { db, renpyTable } from "@/db/schema";
import { deletePost } from "../api";
import { cookies } from 'next/headers'
export default async function BrowsePage() {
    const userId = (await cookies()).get("userId")?.value;
    const data = await db.select().from(renpyTable);
    return <>
        {
            data.map((x) => <div  key={x.id}><Link href={"/entry/" + x.id}>{x.title}</Link>
            {userId == x.cookie_id ?
            <><Link href={"/entry/edit/" + x.id}>___Edit<br /></Link><form action={deletePost}>
                        <input type="submit" value="Delete"/>
                        <input type="hidden" value={x.id} name="id" id="id"></input>
                    </form></> : ""}</div>)
        }
    </>
  }
  