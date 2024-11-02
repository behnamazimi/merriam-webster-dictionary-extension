import React from 'react';
import Header from "./components/Header/Header";
import ActiveSection from "./components/ActiveSection/ActiveSection";

chrome.runtime.connect({name: "popup"});

const Popup = () => {

  return (
    <>
      <Header/>
      <ActiveSection/>
    </>
  )
}

export default Popup