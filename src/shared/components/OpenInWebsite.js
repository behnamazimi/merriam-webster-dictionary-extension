import styled from "styled-components";
import {colors} from "../utils/theme";

const StyledLink = styled.a`
  ${({$notSticky}) => $notSticky ? "" : `
    position: sticky;
    top: 40px;
  `};
  font-size: 14px;
  display: inline-block;
  color: ${colors.successLight};
  background: #080d23;
  width: 100%;
  padding: 6px 0;
  z-index: 2;
`

const OpenInWebsite = ({target, notSticky = false}) => {
  return (
    <StyledLink
      onClick={() => window.open(`https://www.merriam-webster.com/dictionary/${target}`)}
      target="_blank"
      $notSticky={notSticky}
    >Open in Merriam-Webster</StyledLink>
  )
}

export default OpenInWebsite