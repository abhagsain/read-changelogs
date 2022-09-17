import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getNameAndURLFromPackageName, getReleaseTags } from "../api.server";
import { FETCH_RELEASE_TAGS } from "../constants";

// This can be refactored into a resource route
async function getReleaseTagsFromWorker({ request }: ActionArgs) {
  const form = await request.formData();
  const values = Object.fromEntries(form.entries());
  const packageName = values.name as string;
  const type = values.type as string;
  switch (request.method.toLowerCase()) {
    case "post": {
      if (type === FETCH_RELEASE_TAGS) {
        try {
          const { ownerName, repoName } = await getNameAndURLFromPackageName(
            packageName.toLowerCase()
          );
          const releases = await getReleaseTags(ownerName, repoName);
          return json({ type: FETCH_RELEASE_TAGS, releases });
        } catch (error: any) {
          console.log("🚀 - file: index.tsx - line 52 - action - error", error);
          return json({ error: `${packageName} not found` }, { status: 404 });
        }
      }
    }
  }

  return json({ error: "Invalid request" }, 400);
}

export default getReleaseTagsFromWorker;
