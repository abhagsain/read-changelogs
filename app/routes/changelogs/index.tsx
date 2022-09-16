import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader(args: LoaderArgs) {
  return redirect("/", { status: 301 });
}
