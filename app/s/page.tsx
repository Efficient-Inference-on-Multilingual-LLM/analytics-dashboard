import { redirect } from "next/navigation";
import { decodeShareToken } from "@/lib/url-state/share";
import { PAGE_ROUTES } from "@/lib/url-state/registry";
import { encodeLangs } from "@/lib/url-state/lang-codec";

const ShareRedirect = async ({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) => {
  const { t } = await searchParams;
  if (!t) redirect("/");

  const payload = decodeShareToken(t);
  if (!payload || !PAGE_ROUTES[payload.p]) redirect("/");

  const search = new URLSearchParams();
  Object.entries(payload.s).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "languages" && Array.isArray(value)) {
      if (value.length > 0) search.set(key, encodeLangs(value as string[]));
    } else if (Array.isArray(value)) {
      if (value.length > 0) search.set(key, value.join(","));
    } else {
      search.set(key, String(value));
    }
  });

  redirect(`${PAGE_ROUTES[payload.p]}?${search.toString()}`);
};

export default ShareRedirect;
