import { marked } from "marked";
import { FormData, NPMResponse, Release, ReleaseVersion } from "./types";


export const getNameAndURLFromPackageName = async (name: string) => {
  const URL = `https://api.npms.io/v2/package/${name}`;
  const res = (await fetch(URL).then((res) => res.json())) as NPMResponse;
  const repoURL = res.collected.metadata.links.repository;
  const [ownerName, repoName] =
    repoURL.split("https://github.com/").join("").split("/") || [];
  return { ownerName, repoName };
};

export const getReleaseNames = async (
  authorName: string,
  repoName: string
): Promise<ReleaseVersion[]> => {
  const URL = `https://api.github.com/repos/${authorName}/${repoName}/tags?per_page=100`;
  return fetch(URL).then((res) => res.json());
};

export const getRelease = async (
  name: string,
  fromVersion: string,
  toVersion: string
) => {
  const { ownerName, repoName } = await getNameAndURLFromPackageName(name);
  const from = getTags(ownerName, repoName, fromVersion);
  const to = getTags(ownerName, repoName, toVersion);
  const [fromData, toData]: [Release, Release] = await Promise.all([from, to]);
  const releases = await getReleaseNames(ownerName, repoName);
  return {
    releases,
    from: fromData?.body
      ? {
          ...fromData,
          html: marked(fromData.body),
        }
      : undefined,
    to: toData?.body
      ? {
          ...toData,
          html: marked(toData.body),
        }
      : undefined,
  };
};

export const getReleases = async (values: FormData[]) => {
  const releases = await Promise.all(
    values.map(({ name, from, to }) => getRelease(name, from, to))
  );
  return releases;
};

export const getTags = async (
  authorName: string,
  repoName: string,
  tagName: string
) => {
  const data = await fetch(
    ` https://api.github.com/repos/${authorName}/${repoName}/releases/tags/${tagName}`
  ).then((res) => res.json());
  return data;
};
