import { useNavigate, useParams } from "@remix-run/react";
import isEmpty from "lodash/isEmpty";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { AutocompleteOption } from "../types";

const useChangeLogState = () => {
  const [selectedReleases, setSelectedReleases] = useState<
    AutocompleteOption[]
  >([]);
  const { releaseVersions } = useParams();
  const navigate = useNavigate();

  const getRoute = ({
    name,
    actionType,
    versions,
  }: {
    name: string;
    actionType: "add" | "remove";
    versions?: AutocompleteOption[];
  }) => {
    const updatesSearchParams = new URLSearchParams(releaseVersions);
    const selectedReleaseVersions = (versions || selectedReleases)
      .map((tag) => tag.value)
      .join(",");
    if (isEmpty(selectedReleaseVersions) && actionType === "add") {
      toast.error("Please select release versions");
      return;
    }
    if (updatesSearchParams.has(name) && actionType === "add") {
      updatesSearchParams.set(name, `${selectedReleaseVersions}`);
    } else if (updatesSearchParams.has(name) && actionType === "remove") {
      updatesSearchParams.delete(name);
    } else {
      updatesSearchParams.append(name, `${selectedReleaseVersions}`);
    }

    return updatesSearchParams;
  };

  const updateReleaseVersion = (
    name: string,
    versions?: AutocompleteOption[]
  ) => {
    const route = getRoute({
      name,
      actionType: "remove",
      versions,
    });
    if (route) {
      navigate(`/changelogs/${route.toString()}`);
    }
  };

  const removeReleaseVersion = (
    name: string,
    versions?: AutocompleteOption[]
  ) => {
    const route = getRoute({
      name,
      actionType: "remove",
      versions,
    });

    if (route) {
      navigate(`/changelogs/${route.toString()}`);
    }
  };

  return {
    selectedReleases,
    setSelectedReleases,
    updateReleaseVersion,
    removeReleaseVersion,
  };
};

export default useChangeLogState;
