import { SearchIcon } from "@heroicons/react/solid";
import { useFetcher } from "@remix-run/react";
import uniqueId from "lodash/uniqueId";
import nProgress from "nprogress";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Label from "../components/Label";
import MultiSelect from "../components/MultiSelect/MultiSelect";
import { FETCH_RELEASE_TAGS } from "../constants";
import useChangeLogState from "../hooks/useChangelogState";
import type { AutocompleteOption, IChangeLog } from "../types";

const SearchForm = ({
  name,
  releases: defaultReleases,
}: {
  name?: string;
  releases?: IChangeLog[];
}) => {
  const [releases, setReleases] = useState<IChangeLog[]>(defaultReleases ?? []);
  const [id] = useState(uniqueId());
  const fetcher = useFetcher();
  const [packageName, setPackageName] = useState("");
  const { selectedReleases, setSelectedReleases, updateVersionAndNavigate } =
    useChangeLogState();

  useEffect(() => {
    if (fetcher.data?.type === FETCH_RELEASE_TAGS) {
      setReleases(fetcher.data.releases);
      toast("Please select release versions", {
        icon: "👋",
      });
      nProgress.done();
    }
    if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
      nProgress.done();
    }
  }, [fetcher.data]);

  const fetchReleaseTags = () => {
    if (!packageName?.trim())
      return toast.error("Please enter the package name");

    const form = new FormData();
    form.append("name", packageName);
    try {
      form.append("type", FETCH_RELEASE_TAGS);
      nProgress.start();
      fetcher.submit(form, { method: "post" });
    } catch (error: any) {
      nProgress.done();
      toast.error(error.message);
      console.log("🚀 - file: index.tsx - line 84 - onSubmit - error", error);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!selectedReleases.length) {
      toast.error("Please select release versions");
      return;
    }
    try {
      const name = form.get("name") as string;
      updateVersionAndNavigate(name);
    } catch (error: any) {
      toast.error(error.message);
      console.log("🚀 - file: index.tsx - line 84 - onSubmit - error", error);
    }
  };

  const options: AutocompleteOption[] = releases.map((release) => ({
    label: release.name,
    value: release.name,
  }));

  return (
    <div className="flex px-8 py-10">
      <form
        autoComplete="off"
        className="relative z-50 flex-col items-center w-full space-x-4"
        onSubmit={onSubmit}
      >
        <div className="flex items-end space-x-4">
          <div className="flex flex-col w-full max-w-sm space-y-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-white/95"
            >
              Name
            </label>
            <div className="flex mt-1 rounded-md shadow-sm ">
              <div className="relative flex items-stretch flex-grow focus-within:z-10">
                <input
                  name="name"
                  id="name"
                  value={packageName}
                  defaultValue={name}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full rounded-l-md border border-secondary py-2.5 pl-3 pr-10 shadow-sm focus:outline-accent focus:outline focus:ring-white/80 text-white/95 sm:text-sm bg-secondary "
                  placeholder="Package name. eg. react, react-redux"
                />
              </div>
              <button
                onClick={fetchReleaseTags}
                disabled={!packageName?.trim()}
                type="button"
                className="relative inline-flex items-center px-4 py-2 -ml-px space-x-2 text-sm font-medium text-gray-700 dark:active:bg-white/20 dark:bg-secondary dark:text-white/95 rounded-r-md bg-gray-50 hover:bg-white/20 focus:border-indigo-500 focus:outline-accent"
              >
                <SearchIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
                <span>Search</span>
              </button>
            </div>
          </div>
          {releases.length ? (
            <>
              <div className="flex flex-col w-full max-w-sm space-y-1">
                <Label htmlFor="versions">Select Versions</Label>
                <MultiSelect
                  isMulti
                  key={`${id}-${options.length}`}
                  // autoFocus={!!options.length}
                  name="versions"
                  id="versions"
                  options={options}
                  onChange={(values) => {
                    setSelectedReleases(values as AutocompleteOption[]);
                  }}
                  // defaultMenuIsOpen={!!options.length}
                  isSearchable
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 mt-3 ml-auto transition-colors duration-100 rounded bg-secondary hover:bg-opacity-75"
              >
                Submit
              </button>
            </>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
