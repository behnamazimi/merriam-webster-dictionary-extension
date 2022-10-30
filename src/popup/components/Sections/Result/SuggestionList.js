import {useState} from "react";
import {useData} from "../../../context/data.context";
import {List, Spin} from "antd";
import styled from "styled-components";
import {colors, spacings} from "../../../../shared/utils/theme";
import {services} from "../../../../shared/utils/services";
import {sendGlobalMessage} from "../../../../shared/utils/messaging";
import {globalActions,} from "../../../../shared/utils/constants";

const StyledNoResult = styled.div`
  padding: 40px ${spacings.m} 0 ${spacings.m};
  color: ${colors.textDark};
`

const SuggestionList = ({suggestions = []}) => {
  const [loading, setLoading] = useState(false)
  const {searchFor, setSearchFor, setResult, setError} = useData()
  if (!suggestions || !suggestions.length) return

  const shortedSearchFor = searchFor.substring(0, 12)

  const handleReSearch = (itemToSearchFor) => {
    setSearchFor(itemToSearchFor);
    setLoading(true)
    services.fetchData(itemToSearchFor)
      .then((res) => {
        sendGlobalMessage({action: globalActions.ADD_TO_HISTORY, searchTrend: itemToSearchFor})
        setResult(res)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }

  return (
    <Spin spinning={loading} delay={0}>
      <List
        header={<StyledNoResult>No result for {shortedSearchFor}!
          <br/>Here are the similar ones to what you're looking for:</StyledNoResult>}
        size="small"
        dataSource={suggestions}
        renderItem={item => (
          <List.Item padding={0}>
            <a onClick={() => handleReSearch(item)}>{item}</a>
          </List.Item>
        )}
      />
    </Spin>
  )
}

export default SuggestionList