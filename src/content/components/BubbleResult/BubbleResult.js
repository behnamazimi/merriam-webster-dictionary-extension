import styled from "styled-components";
import BubbleResultItem from "./BubbleResultItem";
import OpenInWebsite from "../../../shared/components/OpenInWebsite";

const StyledResult = styled.div`
  padding: 0;
  position: relative;
`

const BubbleResult = ({searchFor, result = []}) => (
  <StyledResult>
    <OpenInWebsite target={searchFor} notSticky/>
    {result.filter(item => item.shortDef).map((item, index) => (
      <BubbleResultItem item={item} key={index}/>
    ))}
  </StyledResult>
)

export default BubbleResult