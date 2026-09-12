type SubpageHeroMediaProps = {
  src: string;
  alt: string;
  position?: "top" | "center";
};

export function SubpageHeroMedia({ src, alt, position = "top" }: SubpageHeroMediaProps) {
  return (
    <figure className="sp-hero-media" data-position={position}>
      <img
        src={src}
        alt={alt}
        loading="eager"
        fetchPriority="low"
        decoding="async"
        width={1440}
        height={1000}
      />
    </figure>
  );
}
