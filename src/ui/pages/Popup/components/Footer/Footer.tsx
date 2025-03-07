import React from "react";
import {
  ActionIcon,
  Flex,
  Group,
  Text, Tooltip,
  useComputedColorScheme
} from "@mantine/core";
import { AiFillHeart } from "react-icons/ai";
import StarRating from "../StarRating";

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function () {
  const colorScheme = useComputedColorScheme("dark");

  return (
    <Flex
      justify="space-between"
      align="center"
      py="6"
      px="sm"
      bg={colorScheme === "light" ? "gray.0" : "dark.8"}
      pos="sticky"
      bottom={0}
    >
      <StarRating />
      <Group justify="center" align="center" gap="xs">
        <Tooltip label={<Text size="xs">Support the project</Text>}>
          <ActionIcon
            variant="subtle"
            c="red"
            onClick={() => {
              window.open("https://buymeacoffee.com/behi", "_blank");
            }}
            aria-label="Support the project"
          >
            <AiFillHeart size={18} />
          </ActionIcon>
        </Tooltip>

      </Group>
    </Flex>
  );
};
