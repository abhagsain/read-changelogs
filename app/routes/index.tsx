import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  getChangelogList,
  getNameAndURLFromPackageName,
  getReleaseTags
} from "../api.server";
import ReleaseList from "../components/ReleaseList";
import SearchForm from "../components/SearchForm";
import { FETCH_RELEASE_TAGS } from "../constants";
import type { LoaderData } from "../types";
import { parseDynamicSearchParams } from "../utils";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const term = url.searchParams;
  const formValues = parseDynamicSearchParams(term);
  const response = await getChangelogList(formValues);
  if (response instanceof Response) {
    return response;
  }
  return json<LoaderData>(response);
}

export default function Index() {
  const releases = useLoaderData() as unknown as LoaderData;

  return (
    <div className="mx-auto max-w-[90%] my-16 space-y-40">
      <SearchForm />
      {releases.length ? <ReleaseList releases={releases} /> : null}
    </div>
  );
}

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const values = Object.fromEntries(form.entries());
  const packageName = values.name as string;
  const type = values.type as string;
  switch (request.method.toLowerCase()) {
    case "post": {
      if (type === FETCH_RELEASE_TAGS) {
        try {
          const { ownerName, repoName } = await getNameAndURLFromPackageName(
            packageName
          );
          const releases = await getReleaseTags(ownerName, repoName);
          return json({ type: FETCH_RELEASE_TAGS, releases });
        } catch (error: any) {
          console.log("🚀 - file: index.tsx - line 52 - action - error", error)
          return json({ error: `${packageName} not found` }, { status: 404 });
        }
      }
    }
  }

  return json({ error: "Invalid request" }, 400);
}
