import { useEffect, useRef } from "react";

interface InstagramEmbedProps {
  embedHtml: string;
}

export const InstagramEmbed = ({ embedHtml }: InstagramEmbedProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.querySelector('script[src="//www.instagram.com/embed.js"]')) {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, []);

  useEffect(() => {
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, [embedHtml]);

  return (
    <div
      ref={ref}
      className="instagram-embed"
      dangerouslySetInnerHTML={{ __html: embedHtml }}
      style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}
    />
  );
}; 