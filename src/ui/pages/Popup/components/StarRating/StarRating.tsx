import React, { useEffect, useState } from "react";
import {
  Rating,
  Text,
  Tooltip
} from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { REVIEW_US } from "../../../../../constants/constants";

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function () {
  const [value, setValue] = useState(0);
  const interval = useInterval(() => setValue(s => s + 1), 250, { autoInvoke: true });

  useEffect(() => {
    return interval.stop;
  }, []);

  useEffect(() => {
    if (value >= 5) {
      interval.stop();
    }
  }, [value]);

  const onRatingClick = () => {
    const ratingLink = "https://bit.ly/rate-mwd";
    window.open(ratingLink, "_blank");
  };

  // get an item from REVIEW_US by chance on every render
  const ratingTooltipText = REVIEW_US[Math.floor(Math.random() * REVIEW_US.length)];

  return (
    <Tooltip label={<Text size="xs">{ratingTooltipText}</Text>}>
      <Rating onClick={onRatingClick} size="xs" value={value} color="orange" />
    </Tooltip>
  );
};
