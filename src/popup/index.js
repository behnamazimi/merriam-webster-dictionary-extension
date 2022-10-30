import ReactDOM from "react-dom/client"
import {StrictMode} from "react";
import Popup from "./Popup";
import DataProvider from "./context/data.context";
import {colors} from "../shared/utils/theme";
import "../shared/utils/services"
import {createGlobalStyle} from "styled-components";

const GlobalStyles = createGlobalStyle`

  html {
    @import "https://fonts.googleapis.com/css?family=Roboto";
    height: auto;
  }

  body {
    width: 380px;
    height: auto;
    max-height: 690px;
    overflow: hidden;
    overflow-y: scroll;
    background: ${colors.main};
    margin: 0 auto;
    cursor: default;
    font-family: 'Roboto', Arial, sans-serif;
    font-size: 16px;
  }
`

const root = ReactDOM.createRoot(document.getElementById("popup-app"))
root.render(
  <StrictMode>
    <GlobalStyles/>
    <DataProvider>
      <Popup/>
    </DataProvider>
  </StrictMode>
)