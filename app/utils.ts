import transform from "lodash/transform";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import camelCase from "lodash/camelCase";
import type { SearchFormData } from "./types";
import semver from "semver";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
};

export const camelize = (obj: any) =>
  transform(obj, (acc: any, value, key: any, target) => {
    const camelKey = isArray(target) ? key : camelCase(key);

    acc[camelKey] = isObject(value) ? camelize(value) : value;
  });

export const parseOwnerNameAndRepoName = (url?: string) =>
  url?.split("https://api.github.com/repos/").join("").split("/") ?? [];

export const getJSON = async (API_URL: string) => {
  const data = await fetch(API_URL, {
    headers: {
      ...headers,
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    throw new Error(res.statusText);
  });
  return data;
};

export const parseDynamicSearchParams = (searchParams: URLSearchParams) => {
  const formValues = [...searchParams.entries()].reduce(
    (acc: SearchFormData[], curr: [string, string], _index) => {
      const [name, selectedVersions] = curr;
      const versions = selectedVersions
        .split(",")
        .filter((versionNumber) => semver.valid(versionNumber))
        .sort(semver.compare);
      return [...acc, { name: name.toLowerCase(), versions }];
    },
    []
  );
  return formValues;
};
