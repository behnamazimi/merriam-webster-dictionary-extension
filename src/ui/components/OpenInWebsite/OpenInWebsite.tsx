import React from "react";
import { Anchor } from "@mantine/core";

type OpenInWebsiteProps = {
  target: string;
  notSticky?: boolean;
};

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function ({ target, notSticky = false }: OpenInWebsiteProps) {
  return (
    <Anchor
      onClick={() => window.open(`https://www.merriam-webster.com/dictionary/${target}`)}
      target="_blank"
      pos={notSticky ? "static" : "sticky"}
      top={notSticky ? "auto" : "40px"}
      c="orange"
      size="sm"
    >
      Open in Merriam-Webster
    </Anchor>
  );
};
