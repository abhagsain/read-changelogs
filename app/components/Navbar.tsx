import { Link } from "@remix-run/react";

const Navbar = () => {
  return (
    <nav className="my-4 bg- not-prose">
      <div className="max-w-[90%] mx-auto lg:px-8 md:flex-row flex justify-between items-baseline flex-col">
        <Link
          className="py-4 text-xl transition-colors duration-150 text-white/90 decoration-transparent hover:text-white"
          to="/"
        >
          📑 read changelogs
        </Link>
        <div className="flex items-center space-x-2">
          <span>feedback </span>
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
  );
};

export default Navbar;
