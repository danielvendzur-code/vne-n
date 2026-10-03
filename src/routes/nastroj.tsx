import { createFileRoute } from "@tanstack/react-router";
import { Tool } from "@/components/site/redesign/Tool";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/nastroj")({
  validateSearch: (search: Record<string, unknown>) => ({
    t: ["chatbot", "kalkulacka", "poradca"].includes(String(search.t))
      ? String(search.t)
      : "kalkulacka",
  }),
  head: () =>
    seo({
      title: "Chatbot, kalkulačka a produktový poradca | Môj Chatbot",
      description: "Vyberte nástroj na mieru a pozrite si jeho funkcie, postup a živú ukážku.",
      path: "/nastroj",
    }),
  component: ToolPage,
});
function ToolPage() {
  const { t } = Route.useSearch();
  return <Tool key={t} tool={t} />;
}
