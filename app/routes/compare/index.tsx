import type { LoaderArgs } from "@remix-run/node";
export async function loader(args: LoaderArgs) {
  return {};
}

type Props = {};

const Compare = (props: Props) => {
  return <div>Compare</div>;
};

export default Compare;
