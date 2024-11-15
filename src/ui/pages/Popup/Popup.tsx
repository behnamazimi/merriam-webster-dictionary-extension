import React from "react";
import browser from "webextension-polyfill";
import Header from "./components/Header";
import ActiveSection from "./components/ActiveSection/ActiveSection";
import DataProvider from "../../../context/data.context";
import "./popup.scss";
import { Stack } from "@mantine/core";
import Footer from "./components/Footer";

browser.runtime.connect({ name: "popup" });

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function () {
  return (
    <DataProvider>
      <Stack>
        <Header />
        <ActiveSection />
        <Footer />
      </Stack>
    </DataProvider>
  );
}
