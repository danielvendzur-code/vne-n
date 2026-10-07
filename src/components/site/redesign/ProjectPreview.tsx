import { ProductPreview } from "./ProductPreview";
import { PergolaVideo } from "./PergolaVideo";
import s from "./ProjectPreview.module.css";

export function ProjectPreview({ name }: { name: string }) {
  const film = name.includes("konfigurátor");
  const client = name.startsWith("Koverta")
    ? "Koverta"
    : name === "DERAT"
      ? "DERAT"
      : name === "Môj Plot"
        ? "Môj Plot"
        : "WEBKO";
  return (
    <div className={s.preview} data-case-preview={film ? "film" : "interface"}>
      {film ? (
        <PergolaVideo />
      ) : (
        <ProductPreview
          client={client}
          kind={name === "Môj Plot" ? "calculator" : name === "Môj Chatbot" ? "advisor" : "chatbot"}
        />
      )}
      <span className={s.caption}>{film ? "Pohyb vašej zostavy" : "Ukážka rozhrania"}</span>
    </div>
  );
}
