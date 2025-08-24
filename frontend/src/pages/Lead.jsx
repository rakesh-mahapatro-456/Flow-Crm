import React from "react";
import { useTheme } from "@/components/theme-provider";
import LeadTable from "../components/custom/LeadTable";

export default function Lead() {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  return (
    <div className="w-screen h-screen flex flex-col p-4">
      <h1 className="text-3xl font-bold mb-4">Leads</h1>
      <div className="flex-1">
        <LeadTable darkMode={darkMode} />
      </div>
    </div>
  );
}
