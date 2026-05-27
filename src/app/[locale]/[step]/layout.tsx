export function generateStaticParams() {
  return Array.from({ length: 11 }, (_, i) => ({ step: String(i) }));
}

export default function StepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
