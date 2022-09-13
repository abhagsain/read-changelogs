import transform from "lodash/transform";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import camelCase from "lodash/camelCase";

export const camelize = (obj: any) =>
  transform(obj, (acc: any, value, key: any, target) => {
    const camelKey = isArray(target) ? key : camelCase(key);

    acc[camelKey] = isObject(value) ? camelize(value) : value;
  });

export const parseOwnerNameAndRepoName = (url?: string) =>
  url?.split("https://api.github.com/repos/").join("").split("/") ?? [];
