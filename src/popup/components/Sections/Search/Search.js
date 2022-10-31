import React from "react"
import styled from "styled-components";
import {spacings} from "../../../../shared/utils/theme";
import Search from "antd/es/input/Search";
import {useData} from "../../../context/data.context";
import ActionButtons from "../../../../shared/components/ActionButtons";
import {Typography} from "antd";
import AskToRate from "../../../../shared/components/AskToRate";
import ShareOnTwitter from "../../../../shared/components/ShareOnTwitter";

const StyledRoot = styled.div`
  padding: 56px ${spacings.m} ${spacings.m};
`

const StyledFooter = styled.div`
  margin-top: ${spacings.m};
`

const StyledMessage = styled(Typography.Paragraph)`
  font-size: 14px;
  margin-top: ${spacings.s};
  white-space: pre-line;
`

const SearchSection = () => {
  const {
    searchFor, setSearchFor, error, doSearch, loading
  } = useData()

  const handleSearch = (searchTrend) => {
    if (!searchTrend) return
    doSearch(searchTrend)
  }

  return (
    <StyledRoot>
      <Search placeholder="Search for..."
              value={searchFor}
              onSearch={handleSearch}
              onChange={(e) => setSearchFor(e.target.value)}
              enterButton
              loading={loading}
              autoFocus/>

      <StyledMessage type="danger">{error}</StyledMessage>

      <ActionButtons/>

      <StyledFooter>
        <AskToRate/>
      </StyledFooter>

    </StyledRoot>
  )
}

export default SearchSection