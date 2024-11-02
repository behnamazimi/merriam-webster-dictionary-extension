import ReactDOM from "react-dom/client"
import {StrictMode} from "react";
import DataProvider from "./context/data.context";
import Popup from "./Popup";
import "../shared/utils/services"
import "chota/dist/chota.min.css"
import "./popup.scss"

const root = ReactDOM.createRoot(document.getElementById("popup-app"))
root.render(
  <StrictMode>
    <DataProvider>
      <Popup/>
    </DataProvider>
  </StrictMode>
)