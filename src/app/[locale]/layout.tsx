export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "tr" }];
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
