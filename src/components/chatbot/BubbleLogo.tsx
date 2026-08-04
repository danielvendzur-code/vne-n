import { BrandMark } from "@/components/BrandMark";

type BubbleLogoProps = {
  size: "launcher" | "header" | "avatar";
};

/** Veľkosť značky podľa miesta, kde stojí. */
const markSize: Record<BubbleLogoProps["size"], number> = {
  launcher: 30,
  header: 24,
  avatar: 20,
};

/**
 * Značka „Môj Chatbot" vo widgete.
 *
 * Predtým tu sedela úplne iná kresba — obtiahnutý obrys na plátne
 * 1601 × 1629, ktorý s logom nemal spoločné takmer nič: chýbali mu dva
 * vrcholy M aj priehlbina medzi nimi, takže na plávajúcom tlačidle
 * vychádzalo skôr „U". Widget teraz kreslí ten istý symbol ako hlavička
 * webu, pätička aj ikona na ploche telefónu.
 */
export function BubbleLogo({ size }: BubbleLogoProps): JSX.Element {
  return (
    <span className={`bl bl--${size}`} aria-hidden="true">
      <BrandMark size={markSize[size]} />
    </span>
  );
}
