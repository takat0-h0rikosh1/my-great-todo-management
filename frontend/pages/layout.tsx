import MainAppBar from "@/components/MainAppBar";
import { ReactNode, useState } from "react";

const Layout = ({ children }: Props) => {
  return (
    <div>
      <MainAppBar />
      {children}
    </div>
  );
};

type Props = {
  children?: ReactNode;
};

export default Layout;
