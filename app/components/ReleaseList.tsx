import { ExternalLinkIcon, LinkIcon, XIcon } from "@heroicons/react/solid";
import { toast } from "react-hot-toast";
import useChangeLogState from "../hooks/useChangelogState";
import type { AutocompleteOption, LoaderData, IChangeLog } from "../types";
import Changelog from "./Changelog";
import MultiSelect from "./MultiSelect/MultiSelect";

const ReleaseList = ({ releases }: { releases: LoaderData }) => {
  const {
    setSelectedReleases,
    updateVersionAndNavigate,
    removeReleaseVersionAndNavigate,
  } = useChangeLogState();

  const scrollToItem = (name: string) => {
    const item = document.getElementById(`#${name.toLowerCase()}`);
    item?.scrollIntoView(true);
  };

  const renderNav = () => {
    return (
      <section className="sticky top-0 z-10 flex flex-wrap px-8 pt-2 -ml-4 space-x-4 backdrop-blur">
        <div className="flex items-end justify-between w-full">
          <div>
            {releases.map((release) => (
              <button
                key={`nav-${release.repoName}`}
                onClick={() => scrollToItem(release.repoName)}
                className="px-4 py-2 text-lg rounded-md cursor-pointer hover:text-cyan-400 focus:ring focus:ring-white/40 focus:outline-none"
              >
                {release.repoName.toLowerCase()}
              </button>
            ))}
          </div>
          <button
            className="flex items-center px-4 py-2 space-x-3 rounded-md text-white/80 hover:text-white focus:ring focus:ring-white/40 focus:outline-none"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("URL Copied to Clipboard");
            }}
          >
            <LinkIcon className="w-5 h-5 transition-all duration-150 " />
            <span>Copy URL</span>
          </button>
        </div>
      </section>
    );
  };

  const renderGithubURL = (releaseTagList?: IChangeLog[]) => {
    return releaseTagList?.[0]?.html_url;
  };

  const renderCheckGithubMessage = () => (
    <p className="m-0 ml-4">
      If there are no release notes, please check the CHANGELOG.md on the github
      repository
    </p>
  );

  return (
    <div className="space-y-16">
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
                  <div className="flex items-center space-x-3">
                    <h2 className="my-4">{repoName}</h2>
                    <div className="not-prose">
                      <a
                        href={renderGithubURL(
                          release.changeLogs as IChangeLog[]
                        )}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="transition-colors duration-150 text-white/40 hover:text-white focus:ring "
                        title={`View ${repoName} on Github`}
                      >
                        <ExternalLinkIcon className="w-5 h-5 t" />
                      </a>
                    </div>
                  </div>
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
                  <div className="flex items-center space-x-5">
                    <button
                      type="submit"
                      onClick={() => {
                        updateVersionAndNavigate(repoName);
                      }}
                    >
                      Search
                    </button>
                    <button
                      type="submit"
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to remove the changelogs for ${repoName}?`
                          )
                        )
                          removeReleaseVersionAndNavigate(repoName);
                      }}
                    >
                      <XIcon className="w-8 h-8 rounded-lg p-1.5 bg-white/20 hover:bg-white/30 transition-colors duration-200" />
                    </button>
                  </div>
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
