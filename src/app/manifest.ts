import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flitz Beach Olympic Games",
    short_name: "Beach Olympics",
    description: "Olympic Village on your phone.",
    start_url: "/",
    display: "standalone",
    background_color: "#071018",
    theme_color: "#071018",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/app-icon.png",
        sizes: "512x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/app-icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
