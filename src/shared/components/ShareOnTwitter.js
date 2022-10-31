import styled from "styled-components";
import {TwitterOutlined} from "@ant-design/icons";
import {colors} from "../utils/theme";

const StyledLink = styled.a`
  font-size: 14px;
  opacity: 0.8;
  display: flex;
  text-decoration: none;
  align-items: center;
  color: ${colors.text};

  &:hover {
    color: ${colors.successLight};
  }
`

const ShareOnTwitter = () => {
  return (
    <StyledLink id="twitter-share" href="https://bit.ly/mwd-tw-sh" target="_blank">
      <TwitterOutlined/>&nbsp;
      Share with your friends
    </StyledLink>
  )
}

export default ShareOnTwitter