import styled from "styled-components";
import {GithubOutlined} from "@ant-design/icons";
import {colors, spacings} from "../../../shared/utils/theme";

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  z-index: 5;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  width: 100%;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  background-color: ${colors.mainLight};

  .brand {
    color: ${colors.textLight};
  }

  .github {
    display: inline-flex;
    align-items: center;
    color: ${colors.textDark};

    svg {
      margin-right: ${spacings.s};
    }

    &:hover {
      color: ${colors.textLight};
    }
  }
`

const Header = () => {
  return (
    <StyledHeader>
      <a className="brand" href="https://www.merriam-webster.com/" target="_blank">Merriam-Webster' dictionary</a>
      <a className="github" href="https://github.com/behnamazimi/merriam-webster-dictionary-extension" target="_blank">
        <GithubOutlined/>
        Github
      </a>
    </StyledHeader>
  )
}

export default Header