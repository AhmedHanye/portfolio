import { useLocale } from "next-intl";

export function useTextDirection() {
  const locale = useLocale();
  return locale === "ar" ? "rtl" : "ltr";
}
