import React from "react";
import { useData } from "../../context/data.context";
import Search from "../Sections/Search/Search";
import { PAGES } from "../../../../shared/utils/constants";
import Options from "../Sections/Options/Options";
import Result from "../Sections/Result/Result";
import History from "../Sections/History/History";

const ActiveSection = () => {
  const { activeSection } = useData();

  let Section = Search;
  if (activeSection === PAGES.Result)
    Section = Result;
  else if (activeSection === PAGES.Options)
    Section = Options;
  else if (activeSection === PAGES.History)
    Section = History;

  return <Section />;
};

export default ActiveSection;
