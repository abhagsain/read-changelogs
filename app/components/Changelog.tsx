import type { IChangeLog } from "../types";

interface IChangelogProps {
  changeLog?: IChangeLog;
}

const Changelog = ({ changeLog }: IChangelogProps) => {
  if (!changeLog) {
    return (
      <div className="flex items-center justify-center w-full max-w-3xl">
        <h3>Couldn't find info about this release </h3>
      </div>
    );
  }

  const { author, name, tag_name, published_at } = changeLog;
  const formattedDate = new Date(published_at).toLocaleDateString();
  return (
    <article>
      <h3>{name || tag_name} </h3>
      <div className="flex items-center space-x-1 text-white/60">
        <img src={author.avatar_url} alt="" className="w-5 h-5 m-0" />
        <p className="my-1">{author.login}</p>
        <p className="my-1">released this {formattedDate}</p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: changeLog?.html }} />
    </article>
  );
};

export default Changelog;
