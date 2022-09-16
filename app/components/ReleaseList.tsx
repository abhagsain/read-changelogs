import useChangeLogState from "../hooks/useChangelogState";
import type { AutocompleteOption, LoaderData, IChangeLog } from "../types";
import Changelog from "./Changelog";
import MultiSelect from "./MultiSelect/MultiSelect";

const ReleaseList = ({ releases }: { releases: LoaderData }) => {
  const { setSelectedReleases, updateURLSearchParams } = useChangeLogState();

  const scrollToItem = (name: string) => {
    const item = document.getElementById(`#${name.toLowerCase()}`);
    item?.scrollIntoView(true);
  };

  const renderNav = () => {
    if (releases.length <= 1) return null;
    return (
      <nav className="sticky top-0 z-10 flex flex-wrap px-8 pt-2 -ml-4 space-x-4 backdrop-blur">
        {releases.map((release) => (
          <button
            key={`nav-${release.repoName}`}
            onClick={() => scrollToItem(release.repoName)}
            className="px-4 py-2 text-lg rounded-md cursor-pointer hover:text-cyan-400 focus:ring focus:ring-white/40 focus:outline-none"
          >
            {release.repoName}
          </button>
        ))}
      </nav>
    );
  };

  const renderGithubURL = (releaseTagList: IChangeLog[]) => {
    return releaseTagList?.[0].url;
  };

  const renderCheckGithubMessage = () => (
    <p className="m-0 ml-4">
      If there are no release notes, please check the CHANGELOG.md on the github
      repository
    </p>
  );

  return (
    <div className="space-y-4">
      {renderNav()}
      <section className="flex flex-col justify-start space-y-10">
        {releases?.map((release) => {
          const repoName = release.repoName;
          const options = release.releaseTagsList.map((tag) => ({
            label: tag.name,
            value: tag.name,
          }));
          const defaultChangeLogVersions = [
            ...release.changeLogs.map((log) => ({
              label: log?.tag_name,
              value: log?.tag_name,
            })),
          ];

          return (
            <div
              id={`#${release.repoName.toLowerCase()}`}
              key={release.repoName}
            >
              <div className="flex items-center justify-between px-8 space-x-4">
                <div className="flex items-center">
                  <h2 className="my-4">{repoName}</h2>
                  {renderGithubURL(release.releaseTagsList)}
                  {!defaultChangeLogVersions.length
                    ? renderCheckGithubMessage()
                    : null}
                </div>
                <div className="flex items-center space-x-3">
                  <MultiSelect
                    isMulti
                    name="versions"
                    id="versions"
                    options={options}
                    onChange={(values) => {
                      setSelectedReleases(values as AutocompleteOption[]);
                    }}
                    defaultValue={defaultChangeLogVersions}
                    isSearchable
                  />
                  <button
                    type="submit"
                    onClick={() => {
                      updateURLSearchParams(repoName);
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 px-8 lg:grid-cols-2">
                {release.changeLogs.map((release) => (
                  <Changelog changeLog={release} key={release?.node_id} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default ReleaseList;
