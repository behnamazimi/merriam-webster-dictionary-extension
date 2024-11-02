import {useData} from "../../popup/context/data.context";
import {globalActions, PAGES} from "../utils/constants";
import {sendGlobalMessage} from "../utils/messaging";
import Button from "./Button";
import {FiCopy, FiClock, FiArrowLeft, FiSettings, AiOutlineClear} from "react-icons/all";

const ActionButtons = ({onHistoryCopy}) => {

  const {setActiveSection, activeSection, setSearchFor} = useData()

  const onHistoryClear = () => {
    sendGlobalMessage({action: globalActions.CLEAR_HISTORY}, () => {
      setActiveSection(PAGES.Search)
    })
  }

  const onBackBtnClick = () => {
    setSearchFor("")
    setActiveSection(PAGES.Search)
  }

  const showOptionsBtn = activeSection === PAGES.Search
  const showHistoryBtn = activeSection !== PAGES.History && activeSection !== PAGES.Result
  const showClearHistoryBtn = activeSection === PAGES.History
  const showCopyAllBtn = activeSection === PAGES.History && !!onHistoryCopy

  return (
    <div className="ActionButtons">
      {activeSection !== PAGES.Search &&
        <Button className="primary icon-only"
                onClick={onBackBtnClick}>
          <FiArrowLeft/>
        </Button>}
      {showOptionsBtn &&
        <Button className="primary icon"
                onClick={() => setActiveSection(PAGES.Options)}>
          <FiSettings/>Options
        </Button>}
      {showHistoryBtn &&
        <Button className="primary icon"
                onClick={() => setActiveSection(PAGES.History)}>
          <FiClock/>History
        </Button>}

      {showCopyAllBtn &&
        <Button className="primary icon"
                onClick={onHistoryCopy}>
          <FiCopy/> Copy All
        </Button>}
      {showClearHistoryBtn &&
        <Button className="error icon"
                onClick={onHistoryClear}>
          <AiOutlineClear/>Clear
        </Button>}

    </div>
  )
}

export default ActionButtons