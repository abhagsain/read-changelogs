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
    const updatedRoute = new URLSearchParams(releaseVersions);
    const selectedReleaseVersions = (versions || selectedReleases)
      .map((tag) => tag.value)
      .join(",");
    if (isEmpty(selectedReleaseVersions) && actionType === "add") {
      toast.error("Please select release versions");
      return;
    }
    if (updatedRoute.has(name) && actionType === "add") {
      updatedRoute.set(name, `${selectedReleaseVersions}`);
    } else if (updatedRoute.has(name) && actionType === "remove") {
      updatedRoute.delete(name);
    } else {
      updatedRoute.append(name, `${selectedReleaseVersions}`);
    }

    return updatedRoute;
  };

  const updateVersionAndNavigate = (
    name: string,
    versions?: AutocompleteOption[]
  ) => {
    const route = getRoute({
      name,
      actionType: "add",
      versions,
    });
    if (route) {
      navigate(`/changelogs/${route.toString()}`);
    }
  };

  const removeReleaseVersionAndNavigate = (
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
    updateVersionAndNavigate,
    removeReleaseVersionAndNavigate
  };
};

export default useChangeLogState;
