import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

// Installed extensions are causing hydration issue so this is a workaround for that.
// src: https://github.com/facebook/react/issues/24430#issuecomment-1156537554
// (Doesn't work on Safari, react-select styles will break)

document.querySelectorAll("html > script").forEach((s) => {
  s?.parentNode?.removeChild(s);
});

hydrateRoot(document, <RemixBrowser />);
