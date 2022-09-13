import React from "react";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div className="prose max-w-full prose-img:rounded-xl prose-headings:underline prose-a:text-cyan-500 dark:prose-invert">
      {children}
    </div>
  );
}

export default Layout;
