import React from "react";
import {
  ActionIcon,
  Flex,
  Group,
  Rating,
  Text, Tooltip,
  useComputedColorScheme
} from "@mantine/core";
import { AiFillHeart } from "react-icons/ai";
import { REVIEW_US } from "../../../../../constants/constants";

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function () {
  const colorScheme = useComputedColorScheme("dark");

  const onRatingClick = () => {
    const ratingLink = "https://bit.ly/rate-mwd";
    window.open(ratingLink, "_blank");
  };

  // get an item from REVIEW_US by chance on every render
  const ratingTooltipText = REVIEW_US[Math.floor(Math.random() * REVIEW_US.length)];

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
      <Tooltip label={<Text size="xs">{ratingTooltipText}</Text>}>
        <Rating onClick={onRatingClick} size="xs" value={5} color="orange" />
      </Tooltip>
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
