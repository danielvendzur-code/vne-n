import { BrandMark } from "@/components/BrandMark";

interface SymbolProps {
  size?: number;
  className?: string;
}

/** Shared Môj Chatbot mark used across the header, footer and CTA cards. */
export function Symbol({ size = 36, className }: SymbolProps) {
  return <BrandMark size={size} className={className} />;
}
