import type { ActionArgs } from "@remix-run/node";
import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import semver from "semver";
import { getNameAndURLFromPackageName, getReleases, getTags } from "../api";
import { FormData, Release, ReleaseVersion } from "../types";
import { parseOwnerNameAndRepoName } from "../utils";

interface Response {
  releases: ReleaseVersion[];
  from?: Release;
  to?: Release;
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const term = url.searchParams;
  const formValues = [...term.entries()].reduce(
    (acc: FormData[], curr: [string, string], _index) => {
      const [name, versions] = curr;
      const [from, to] = versions.split(",").sort(semver.compare);
      return [...acc, { name, from, to }];
    },
    []
  );
  return json<Response[]>(await getReleases(formValues));
}

interface ChangelogProps {
  release: Release;
}

const Changelog = ({ release }: ChangelogProps) => {
  const { author, name, tag_name, published_at } = release;
  const formattedDate = new Date(published_at).toLocaleDateString();
  return (
    <article>
      <h3>{name || tag_name} </h3>
      <div className="space-x-1 flex items-center text-white/60">
        <img src={author.avatar_url} alt="" className="w-5 h-5 m-0" />
        <p className="my-1">{author.login}</p>
        <p className="my-1">released this {formattedDate}</p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: release?.html }} />
    </article>
  );
};

const ChangeLogList = ({ releases }: { releases: Response[] }) => {
  return (
    <div className="flex flex-col justify-start space-y-10">
      {releases?.map((release) => {
        const [ownerName, repoName] = parseOwnerNameAndRepoName(
          release.from?.url
        );
        return release.from && release.to ? (
          <div>
            <h2>{repoName}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Changelog release={release.from} />
              <Changelog release={release.to} />
            </div>
          </div>
        ) : null;
      })}
      {/* <div dangerouslySetInnerHTML={{ __html: data.release.html }} /> */}
    </div>
  );
};

type LoaderData = Awaited<ReturnType<typeof getReleases>>;

export default function Index() {
  const releases = useLoaderData() as unknown as LoaderData;
  // const releases = release.releases.map((release) => ({
  //   label: release.name,
  //   value: release.name,
  // }));
  // const releaseOptions: AutocompleteOption[] = [];
  // const fetcher = useFetcher();

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const form = new FormData(e.currentTarget);
  //   const values = Object.fromEntries(form.entries()) as FormData;
  // };

  return (
    <div className="mx-auto max-w-[90%]">
      <div className="flex max-w-full">
        {/* <fetcher.Form
          method="post"
          className="flex items-center space-x-4 w-full"
        >
          <div className="flex flex-col">
            <label
              htmlFor=""
              className="block dark:text-white/80 text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              className="w-full rounded-md border border-gray-900 py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-[#30363d]"
              name="name"
              value="react-redux"
            />
          </div>
          <AutoComplete label="From" name="from" options={releaseOptions} />
          <AutoComplete label="To" name="to" options={releaseOptions} />
          <button>Compare</button>
        </fetcher.Form> */}
      </div>
      <ChangeLogList releases={releases} />
    </div>
  );
}

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const values = Object.fromEntries(form.entries()) as FormData;
  try {
    try {
      const { ownerName, repoName } = await getNameAndURLFromPackageName(
        values.name
      );
      const from = getTags(ownerName, repoName, values.from);
      const to = getTags(ownerName, repoName, values.to);
      const [fromData, toData]: [Release, Release] = await Promise.all([
        from,
        to,
      ]);
      return json({
        from: {
          ...fromData,
          html: marked(fromData.body),
        },
        to: {
          ...toData,
          html: marked(toData.body),
        },
      });
    } catch (error) {
      console.log(
        "🚀 - file: index.tsx - line 155 - handleSubmit - error",
        error
      );
    }
    return json({ ok: true });
  } catch (error) {
    // return json({ error: error.message });
  }
}
