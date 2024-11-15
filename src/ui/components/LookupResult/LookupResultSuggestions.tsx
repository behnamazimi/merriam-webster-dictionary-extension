import React from "react";
import { Box, Title, Text, List, Anchor } from "@mantine/core";

type LookupResultSuggestionsProps = {
  suggestions?: string[];
  searchFor: string;
  onReSearch: (searchFor: string) => void;
};

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function ({ suggestions = [], searchFor = "", onReSearch }: LookupResultSuggestionsProps) {
  const shortedSearchFor = searchFor.substring(0, 12);

  return (
    <Box>
      <Title order={4}>
        No result for "
        {shortedSearchFor}
        "!
      </Title>
      <Text c="gray">
        Here are the similar words to what you're looking for:
      </Text>
      <List>
        {suggestions.map((item, index) => (
          <List.Item key={index}>
            <Anchor onClick={() => onReSearch(item)}>{item}</Anchor>
          </List.Item>
        ))}
      </List>
    </Box>
  );
};
