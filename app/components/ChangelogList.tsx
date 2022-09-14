import useChangeLogState from "../hooks/useChangelogState";
import type { AutocompleteOption, LoaderData } from "../types";
import Changelog from "./Changelog";
import MultiSelect from "./MultiSelect/MultiSelect";

const ChangeLogList = ({ changeLogList }: { changeLogList: LoaderData }) => {
  const { setSelectedReleases, updateURLSearchParams } = useChangeLogState();

  const scrollToItem = (name: string) => {
    const item = document.getElementById(`#${name.toLowerCase()}`);
    item?.scrollIntoView(true);
  };

  const renderNav = () => {
    if (changeLogList.length <= 1) return null;
    return (
      <nav className="sticky top-0 z-10 flex flex-wrap px-8 space-x-4 backdrop-blur">
        {changeLogList.map((release) => (
          <div
            key={`nav-${release.repoName}`}
            onClick={() => scrollToItem(release.repoName)}
            className="py-2 text-lg cursor-pointer hover:text-cyan-400"
          >
            {release.repoName}
          </div>
        ))}
      </nav>
    );
  };

  return (
    <div className="space-y-4">
      {renderNav()}
      <section className="flex flex-col justify-start space-y-10">
        {changeLogList?.map((changeLog) => {
          const repoName = changeLog.repoName;
          const options = changeLog.releaseTagsList.map((tag) => ({
            label: tag.name,
            value: tag.name,
          }));
          const defaultChangeLogVersions = [
            ...changeLog.changeLogs.map((log) => ({
              label: log?.tag_name,
              value: log?.tag_name,
            })),
          ];

          return changeLog.changeLogs ? (
            <div id={`#${changeLog.repoName.toLowerCase()}`}>
              <div className="flex items-center justify-between px-8 space-x-4">
                <div className="flex items-center">
                  <h2 className="my-4">{repoName}</h2>
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
                {changeLog.changeLogs.map((release) => (
                  <Changelog changeLog={release} key={release?.node_id} />
                ))}
              </div>
            </div>
          ) : null;
        })}
      </section>
    </div>
  );
};

export default ChangeLogList;
