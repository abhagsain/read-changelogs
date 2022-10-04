import type {
  HeadersFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { invariant } from "@remix-run/router";
import getReleaseTagsFromWorker from "../../actionsFunctions/getReleaseTags";
import { getChangelogList } from "../../api.server";
import ReleaseList from "../../components/ReleaseList";
import SearchForm from "../../components/SearchForm";
import type { LoaderData } from "../../types";
import { parseDynamicSearchParams } from "../../utils";

const BROWSER_CACHE_TTL = 60 * 60 * 24 * 2; // 2 days
const CDN_CACHE_TTL = 60 * 60 * 24 * 10; // 10 days

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": `public, max-age=${BROWSER_CACHE_TTL}, s-maxage=${CDN_CACHE_TTL}`,
  };
};

export const meta: MetaFunction = ({ params }) => {
  const { releaseVersions } = params;
  const packages = parseDynamicSearchParams(
    new URLSearchParams(releaseVersions)
  );

  const nameAndVersions = packages.map(
    (item) => `${item.name} - ${item.versions.join(" Vs ")}`
  );
  const title = `View Changelogs for ${nameAndVersions}`
    .slice(0, 58)
    .concat("...");
  const description =
    `Read changelogs for ${nameAndVersions}. See What's breaking and what's changed.`
      .slice(0, 145)
      .concat("...");

  return {
    title,
    description,
  };
};

export async function loader({ request, params }: LoaderArgs) {
  const { releaseVersions } = params;
  invariant(releaseVersions, "releaseVersions is required");
  const packages = parseDynamicSearchParams(
    // as long as the param is a valid query string, using URLSearchParams is fine,
    // Why not use query string then? So we can take advantage of browser/CDN caching :)
    // caching page based on query string is not recommended
    new URLSearchParams(releaseVersions)
  );
  const response = await getChangelogList(packages);
  if (response instanceof Response) {
    return response;
  }
  return json<LoaderData>(response, {
    headers: {
      "Cache-Control": `public, max-age=${BROWSER_CACHE_TTL}, s-maxage=${CDN_CACHE_TTL}`,
    },
  });
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

export const action = getReleaseTagsFromWorker;
