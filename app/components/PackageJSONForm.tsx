import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Label from "./Label";
import MultiSelect from "./MultiSelect/MultiSelect";

type Props = {};

const PackageJSONForm = (props: Props) => {
  const [packageList, setPackageList] = useState<
    {
      name: string;
      version: string;
    }[]
  >([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = Object.fromEntries(form.entries());
    try {
      const JSON_Data = JSON.parse(values.packageJSON as string);
      if (!("dependencies" in JSON_Data)) {
        toast.error("Couldn't find dependencies in package.json");
        return;
      }

      const packages = Object.entries(JSON_Data.dependencies).map(
        ([name, version]) => ({
          name,
          version: version as string,
        })
      );
      setPackageList(packages);
    } catch (error) {
      console.log(error);
      toast.error("Error parsing package.json");
    }
  };
  const onSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const searchParams = new URLSearchParams(window.location.search);
      packageList.forEach(({ name, version }) => {
        searchParams.set(name, version);
      });
      console.log(searchParams);
      // setSearchParams(searchParams);
    } catch (error) {
      console.log(
        "🚀 - file: index.tsx - line 296 - handleSubmit - error",
        error
      );
      toast.error("Error parsing package.json");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex flex-col justify-end max-w-3xl px-8 space-y-4"
      >
        <div className="space-y-1">
          <Label htmlFor="packageJSON">Enter Package.json</Label>
          <textarea
            rows={12}
            name="packageJSON"
            id="packageJSON"
            className="block w-full p-4 rounded-md shadow-sm outline-none dark:bg-secondary dark:border-secondary focus:ring-accent focus:ring-1 sm:text-lg"
            defaultValue={""}
          />
        </div>
        <button className="px-4 py-2 mt-3 ml-auto transition-colors duration-100 rounded bg-secondary hover:bg-white/80">
          Read
        </button>
      </form>
      {packageList.length ? (
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            onSearch(e);
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="versions">
              Select Package (There's a limit of 8 packages because there's an
              API limit of 10 req/minute for Github)
            </Label>
            <MultiSelect
              closeMenuOnSelect={false}
              options={packageList.map((packageItem) => ({
                label: `${packageItem.name} - ${packageItem.version}`,
                value: `${packageItem.name}`,
              }))}
            />
          </div>
          <button className="px-4 py-2 mt-3 ml-auto transition-colors duration-100 rounded bg-secondary hover:bg-white/80">
            Read
          </button>
        </form>
      ) : null}
    </div>
  );
};

export default PackageJSONForm;
