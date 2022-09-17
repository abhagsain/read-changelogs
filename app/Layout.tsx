import React from "react";
import Navbar from "./components/Navbar";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div className="max-w-full prose prose-img:rounded-xl prose-headings:underline prose-a:text-cyan-500 dark:prose-invert prose-code:bg-black/40 prose-code:py-2 prose-code:px-2 prose-code:rounded prose-code:text-white/80">
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
