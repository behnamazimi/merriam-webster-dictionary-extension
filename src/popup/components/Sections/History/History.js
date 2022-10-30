import styled from "styled-components";
import {colors, spacings} from "../../../../shared/utils/theme";
import ActionButtons from "../../../../shared/components/ActionButtons";
import {useEffect, useState} from "react";
import {loadHistory} from "../../../../shared/utils/storage";
import sortHistoryByDate from "../../../../shared/utils/sortHistoryByDate";
import {List, Spin, Typography} from "antd";
import {services} from "../../../../shared/utils/services";
import {sendGlobalMessage} from "../../../../shared/utils/messaging";
import {globalActions, PAGES} from "../../../../shared/utils/constants";
import {useData} from "../../../context/data.context";
import {message} from 'antd';

const successCopyAlert = () => {
  message.success('Copied!');
};

const StyledRoot = styled.div`
  padding: 56px ${spacings.m} ${spacings.m};
  color: ${colors.text};
`

const useGetSortedHistory = () => {
  const [history, setHistory] = useState([])

  useEffect(() => {
    loadHistory((res) => {
      setHistory(res)
    })

    const handleMessages = ({action}) => {
      if (action === globalActions.CLEAR_HISTORY) {
        setHistory([])
      }
    }

    chrome.runtime.onMessage.addListener(handleMessages)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessages)
    }
  }, [])

  return sortHistoryByDate(history)
}

const History = () => {

  const {setSearchFor, setResult, setActiveSection, setError} = useData()
  const history = useGetSortedHistory()
  const [loading, setLoading] = useState(false)

  const handleReSearch = (searchTrend) => {
    setSearchFor(searchTrend);
    setLoading(true)
    services.fetchData(searchTrend)
      .then((res) => {
        sendGlobalMessage({action: globalActions.ADD_TO_HISTORY, searchTrend})
        setResult(res)
        setActiveSection(PAGES.Result)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }

  const handleHistoryCopy = () => {
    const textToCopy = history.map(([key]) => key).join(", ")
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        successCopyAlert()
      })
  }

  return (
    <StyledRoot>
      <Spin spinning={loading} delay={0}>
        <List
          header={<Typography.Text>Your lookup history:</Typography.Text>}
          size="small"
          dataSource={history || []}
          locale={{emptyText: "No history item yet!"}}
          renderItem={([key, count]) => (
            <List.Item padding={0}>
              <a onClick={() => handleReSearch(key)}>{key}</a>
              <small>{count > 1 ? ` ${count} times` : ""}</small>
            </List.Item>
          )}
        />
      </Spin>
      <ActionButtons onHistoryCopy={handleHistoryCopy}/>
    </StyledRoot>
  )
}

export default History