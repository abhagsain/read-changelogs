import { useSearchParams } from "@remix-run/react";
import { useState } from "react";
import isEmpty from "lodash/isEmpty";
import { toast } from "react-hot-toast";
import type { AutocompleteOption } from "../types";

const useChangeLogState = () => {
  const [selectedReleases, setSelectedReleases] = useState<
    AutocompleteOption[]
  >([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const updateURLSearchParams = (
    name: string,
    versions?: AutocompleteOption[]
  ) => {
    const updatesSearchParams = new URLSearchParams(searchParams);
    const selectedReleaseVersions = (versions || selectedReleases)
      .map((tag) => tag.value)
      .join(",");
    if (isEmpty(selectedReleaseVersions)) {
      toast.error("Please select release versions");
      return;
    }
    if (updatesSearchParams.has(name)) {
      updatesSearchParams.set(name, `${selectedReleaseVersions}`);
    } else {
      updatesSearchParams.append(name, `${selectedReleaseVersions}`);
    }
    setSearchParams(updatesSearchParams);
  };

  return {
    selectedReleases,
    setSelectedReleases,
    updateURLSearchParams,
    searchParams,
    setSearchParams,
  };
};

export default useChangeLogState;
