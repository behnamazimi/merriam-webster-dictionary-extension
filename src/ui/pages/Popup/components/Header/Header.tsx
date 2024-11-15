import React from "react";
import { ActionIcon, Anchor, Flex, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { FiGithub } from "react-icons/fi";

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function () {
  const colorScheme = useComputedColorScheme("dark");

  return (
    <Flex justify="space-between" p="sm" bg={colorScheme === "light" ? "gray.0" : "dark.8"}>
      <Anchor
        href="https://www.merriam-webster.com/"
        target="_blank"
        rel="noreferrer"
        underline="never"
        fw="bold"
        size="sm"
        style={{
          display: "inline-flex",
          alignItems: "center"
        }}
        c={colorScheme === "light" ? "gray.8" : "blue.1"}
      >
        Merriam-Webster' dictionary
      </Anchor>

      <Tooltip label={<Text size="xs">View on GitHub</Text>}>
        <ActionIcon
          variant="subtle"
          c="green"
          onClick={() => {
            window.open("https://github.com/behnamazimi/merriam-webster-dictionary-extension", "_blank");
          }}
        >
          <FiGithub size={18} />
        </ActionIcon>
      </Tooltip>
    </Flex>
  );
}
