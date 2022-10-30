import styled from "styled-components";
import {spacings} from "../utils/theme";
import {Button, Space} from "antd";
import {
  SettingOutlined, HistoryOutlined, ArrowLeftOutlined,
  ClearOutlined, CopyOutlined,
} from "@ant-design/icons";
import {useData} from "../../popup/context/data.context";
import {globalActions, PAGES} from "../utils/constants";
import {sendGlobalMessage} from "../utils/messaging";

const StyledSpace = styled(Space)`
  position: sticky;
  bottom: 0;
  display: flex;
  width: 100%;
  padding: 6px 0;
  z-index: 2;
  margin-top: ${spacings.l};
`

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
    <StyledSpace size={"small"}>
      {activeSection !== PAGES.Search &&
        <Button type="primary"
                icon={<ArrowLeftOutlined/>}
                onClick={onBackBtnClick}/>}
      {showOptionsBtn &&
        <Button type="primary"
                icon={<SettingOutlined/>}
                onClick={() => setActiveSection(PAGES.Options)}>Options</Button>}
      {showHistoryBtn &&
        <Button type="primary"
                icon={<HistoryOutlined/>}
                onClick={() => setActiveSection(PAGES.History)}>History</Button>}

      {showCopyAllBtn &&
        <Button type="primary"
                icon={<CopyOutlined/>}
                onClick={onHistoryCopy}>Copy All</Button>}
      {showClearHistoryBtn &&
        <Button type="danger"
                icon={<ClearOutlined/>}
                onClick={onHistoryClear}>Clear</Button>}

    </StyledSpace>
  )
}

export default ActionButtons