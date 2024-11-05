import { useData } from "../../pages/popup/context/data.context";
import { PAGES } from "../utils/constants";
import { sendGlobalMessage } from "../utils/messaging";
import Button from "./Button";
import { FiCopy, FiClock, FiArrowLeft, FiSettings } from "react-icons/fi";
import { AiOutlineClear } from "react-icons/ai";
import React, { FC } from "react";
import { GlobalActionTypes } from "../../types";

const ActionButtons: FC<{
  onHistoryCopy?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ onHistoryCopy }) => {
  const { setActiveSection, activeSection, setSearchFor } = useData();

  const onHistoryClear = async () => {
    await sendGlobalMessage({ action: GlobalActionTypes.CLEAR_HISTORY });
    setActiveSection("Search");
  };

  const onBackBtnClick = () => {
    setSearchFor("");
    setActiveSection("Search");
  };

  const showOptionsBtn = activeSection === PAGES.Search;
  const showHistoryBtn = activeSection !== PAGES.History && activeSection !== PAGES.Result;
  const showClearHistoryBtn = activeSection === PAGES.History;
  const showCopyAllBtn = activeSection === PAGES.History && !!onHistoryCopy;

  return (
    <div className="ActionButtons">
      {activeSection !== PAGES.Search
      && (
        <Button
          className="primary icon-only"
          onClick={onBackBtnClick}
        >
          <FiArrowLeft />
        </Button>
      )}
      {showOptionsBtn
      && (
        <Button
          className="primary icon"
          onClick={() => setActiveSection("Options")}
        >
          <FiSettings />
          Options
        </Button>
      )}
      {showHistoryBtn
      && (
        <Button
          className="primary icon"
          onClick={() => setActiveSection("History")}
        >
          <FiClock />
          History
        </Button>
      )}

      {showCopyAllBtn
      && (
        <Button
          className="primary icon"
          onClick={onHistoryCopy}
        >
          <FiCopy />
          {" "}
          Copy All
        </Button>
      )}
      {showClearHistoryBtn
      && (
        <Button
          className="error icon"
          onClick={onHistoryClear}
        >
          <AiOutlineClear />
          Clear
        </Button>
      )}

    </div>
  );
};

export default ActionButtons;