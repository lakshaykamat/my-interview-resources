import { revalidateTag } from "next/cache";

export async function POST() {
  revalidateTag("notion-pages", { expire: 0 });
  return Response.json({ revalidated: true });
}
