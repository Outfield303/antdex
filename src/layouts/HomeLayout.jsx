import React from "react";
import Topbar from "../components/Topbar";

export default function HomeLayout({ children }) {
  return (
    <main
      className="
    bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black
    h-screen overflow-y-auto"
    >
      <Topbar />
      {children}
    </main>
  );
}
