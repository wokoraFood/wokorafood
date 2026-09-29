import { redirect } from "next/navigation";

export default function AdminMenuSlugRedirect({ params }: { params: { slug: string } }) {
  redirect(`/admin/menu?plate=${params.slug}`);
}
