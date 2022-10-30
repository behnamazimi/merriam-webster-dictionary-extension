import {colors, spacings} from "../../../shared/utils/theme";
import styled from "styled-components";

const StyledNoResult = styled.div`
  padding: ${spacings.s};
  color: ${colors.textDark};
`

const StyledList = styled.ul`
  padding-left: ${spacings.l};
  margin: 0;

  a {
    cursor: pointer;
  }
`

const BubbleSuggestionList = ({suggestions = [], searchFor = "", onReSearch}) => {
  const shortedSearchFor = searchFor.substring(0, 12)

  return (
    <>
      <StyledNoResult>
        No result for "{shortedSearchFor}"!
        <br/>Here are the similar ones to what you're looking for:
      </StyledNoResult>
      <StyledList>
        {suggestions.map((item, index) => (
          <li key={index}>
            <a onClick={() => onReSearch(item)}>{item}</a>
          </li>
        ))}
      </StyledList>
    </>
  )
}

export default BubbleSuggestionList