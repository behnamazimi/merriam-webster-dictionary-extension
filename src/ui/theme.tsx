import React, { FC, PropsWithChildren } from "react";
import { createTheme, MantineColorScheme, MantineColorsTuple, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

const myColor: MantineColorsTuple = [
  "#dffbff",
  "#caf2ff",
  "#99e2ff",
  "#64d2ff",
  "#3cc4fe",
  "#23bcfe",
  "#09b8ff",
  "#00a1e4",
  "#008fcd",
  "#007cb6"
];

export const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  colors: {
    myColor
  }
});

type ThemeProviderTypes = PropsWithChildren<{
  colorScheme: MantineColorScheme;
}>;

export const ThemeProvider: FC<ThemeProviderTypes> = ({ children, colorScheme = "dark" }) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
      {children}
    </MantineProvider>
  );
};
