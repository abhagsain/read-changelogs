import { Link } from "@remix-run/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div className="max-w-full prose prose-img:rounded-xl prose-headings:underline prose-a:text-cyan-500 dark:prose-invert prose-code:bg-black/40 prose-code:py-2 prose-code:px-2 prose-code:rounded prose-code:text-white/80">
      <nav className="my-4 bg- not-prose">
        <div className="max-w-[90%] mx-auto px-8 flex justify-between items-baseline ">
          <Link
            className="py-4 text-xl transition-colors duration-150 text-white/90 decoration-transparent hover:text-white"
            to="/"
          >
            📑 read changelogs
          </Link>
          <div className="flex items-center space-x-2">
            <span>feedbacks </span>
            <a
              href="https://github.com/abhagsain/read-changelogs"
              rel="noopener noreferrer"
              className="transition-colors duration-150 hover:text-white"
              target="_blank"
            >
              on github
            </a>
            <span>or</span>
            <a
              href="https://twitter.com/abhagsain"
              rel="noopener noreferrer"
              className="transition-colors duration-150 hover:text-white text-cyan-500"
              target="_blank"
            >
              @abhagsain
            </a>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}

export default Layout;
