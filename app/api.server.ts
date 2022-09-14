import { marked } from "marked";
import type { IChangeLog, SearchFormData } from "./types";
import { getJSON } from "./utils";
const WORKER_ENDPOINT = process.env.WORKER_URL || "http://localhost:8787/api";

export const getNameAndURLFromPackageName = async (name: string) => {
  const API_ENDPOINT = `${WORKER_ENDPOINT}/package/${name}`;
  const res = await fetch(API_ENDPOINT).then((res) => res.json());
  const { ownerName, repoName } = res;
  return { ownerName, repoName };
};

export const getReleaseTags = async (
  ownerName: string,
  repoName: string,
  perPage = 100,
  page = 1
): Promise<IChangeLog[] | Response> => {
  const URL = `${WORKER_ENDPOINT}/repos/${ownerName}/${repoName}/tags?per_page=${perPage}&page=${page}`;
  const data = await getJSON(URL);
  return data;
};

export const getReleaseInfo = async (
  name: string,
  versions: SearchFormData["versions"]
) => {
  const { ownerName, repoName } = (await getNameAndURLFromPackageName(
    name
  )) as { ownerName: string; repoName: string };
  const versionPromise = versions.map((version) =>
    getTagByVersion(ownerName, repoName, version)
  );
  const result = await Promise.allSettled(versionPromise).then((res) => {
    return res
      .filter((r) => r.status === "fulfilled")
      .map((r) =>
        r.status === "fulfilled"
          ? {
              ...(r.value as IChangeLog),
              html: marked((r.value as IChangeLog).body),
            }
          : undefined
      );
  });
  const releaseTagsList = (await getReleaseTags(
    ownerName,
    repoName
  )) as IChangeLog[];
  return {
    ownerName,
    repoName,
    releaseTagsList,
    changeLogs: result,
  };
};

export const getChangelogList = async (values: SearchFormData[]) => {
  const releases = await Promise.all(
    values.map(({ name, versions }) => getReleaseInfo(name, versions))
  );
  return releases;
};

export const getTagByVersion = async (
  authorName: string,
  repoName: string,
  tagName: string
): Promise<IChangeLog> => {
  const API_URL = `${WORKER_ENDPOINT}/repos/${authorName}/${repoName}/releases/tags/${tagName}`;
  return getJSON(API_URL);
};
