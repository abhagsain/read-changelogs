import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetchers,
  useTransition,
} from "@remix-run/react";
import NProgress from "nprogress";
import { useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import Layout from "./Layout";
import styles from "./tailwind.css";
import npProgress from "../styles/np-progress.css";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: npProgress },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
  title: "Read Changelogs",
  description: `Read GitHub release notes for multiple packages on a single page.
  No more switching back-and-forth searching for new features or breaking changes.`,
  "og:image": "https://changelogs.vercel.app/og-img.png",
});

export default function App() {
  let transition = useTransition();
  let fetchers = useFetchers();
  let state = useMemo<"idle" | "loading">(
    function getGlobalState() {
      let states = [
        transition.state,
        ...fetchers.map((fetcher) => fetcher.state),
      ];
      if (states.every((state) => state === "idle")) return "idle";
      return "loading";
    },
    [transition.state, fetchers]
  );

  useEffect(() => {
    if (state === "loading") NProgress.start();
    if (state === "idle") NProgress.done();
  }, [state]);

  return (
    <html lang="en" className="dark scroll-smooth scroll-pt-72">
      <head>
        <Meta />
        <Links />
      </head>
      <body className=" dark:bg-primary">
        <Toaster />
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
