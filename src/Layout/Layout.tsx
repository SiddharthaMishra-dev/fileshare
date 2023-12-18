import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <div className="h-full w-full p-4 overflow-hidden overflow-y-auto">{children}</div>;
};

export default Layout;
