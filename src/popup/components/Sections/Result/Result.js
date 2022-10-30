import {useData} from "../../../context/data.context";
import styled from "styled-components";
import {spacings} from "../../../../shared/utils/theme";
import ResultItem from "./ResultItem";
import OpenInWebsite from "../../../../shared/components/OpenInWebsite";
import ActionButtons from "../../../../shared/components/ActionButtons";
import SuggestionList from "./SuggestionList";

const StyledResult = styled.div`
  padding: 40px ${spacings.m} ${spacings.m};
`

const Result = () => {
  const {result, searchFor} = useData()

  if (result?.length && typeof result[0] === "string") {
    return (
      <>
        <SuggestionList suggestions={result}/>
        <ActionButtons/>
      </>
    )
  }

  return (
    <StyledResult>
      <OpenInWebsite target={searchFor}/>
      {result.filter(item => item.shortDef).map((item, index) => (
        <ResultItem item={item} key={index}/>
      ))}
      <ActionButtons/>
    </StyledResult>
  )
}

export default Result