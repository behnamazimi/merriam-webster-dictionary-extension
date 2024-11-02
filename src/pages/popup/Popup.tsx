import React from 'react';
import browser from "webextension-polyfill";
import Header from "./components/Header/Header";
import ActiveSection from "./components/ActiveSection/ActiveSection";
import DataProvider from "./context/data.context";
import "../../shared/utils/services.js"
import "chota/dist/chota.min.css"
import "./popup.scss"

browser.runtime.connect({name: "popup"});

const Popup = () => {

  return (
    <>
      <DataProvider>
        <Header/>
        <ActiveSection/>
      </DataProvider>
    </>
  )
}

export default Popup