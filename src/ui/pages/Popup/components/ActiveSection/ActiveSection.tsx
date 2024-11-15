import React from "react";
import { useActiveSection } from "../../../../../context/data.context";
import Search from "../sections/Search/Search";
import Options from "../sections/Options/Options";
import Result from "../sections/Result/Result";
import History from "../sections/History/History";

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function () {
  const { activeSection } = useActiveSection();

  let Section = Search;
  if (activeSection === "Result")
    Section = Result;
  else if (activeSection === "Options")
    Section = Options;
  else if (activeSection === "History")
    Section = History;

  return <Section />;
};
