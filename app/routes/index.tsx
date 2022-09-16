import { Link } from "@remix-run/react";
import getReleaseTagsFromWorker from "../actionsFunctions/getReleaseTags";
import SearchForm from "../components/SearchForm";

export default function Index() {
  return (
    <div className="mx-auto max-w-[90%] my-16 space-y-40">
      <div className="flex flex-col">
        <div className="px-8 not-prose">
          <h1 className="text-lg lg:text-3xl">
            Read Changelogs For Multiple Packages On A Single Page
          </h1>
        </div>
        <SearchForm />
        <div className="px-8 not-prose text-cyan-500">
          <Link to="/changelogs/react=v16.0.0%2Cv17.0.0%2Cv18.0.0&react-redux=v8.0.0%2Cv7.0.1%2Cv6.0.0">
            Or Read changelog for React v16.0.0,v17.0.0,v18.0.0 and react-redux
            v6.0.0,v7.0.1,v8.0.0,
          </Link>
        </div>
      </div>
    </div>
  );
}

export const action = getReleaseTagsFromWorker;
