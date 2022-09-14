import React from "react";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div className="max-w-full prose prose-img:rounded-xl prose-headings:underline prose-a:text-cyan-500 dark:prose-invert">
      {children}
    </div>
  );
}

export default Layout;
