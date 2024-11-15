import ActionButtons from "../../ActionBar/ActionBar";
import React, { useState } from "react";
import { services } from "../../../../../../utils/services";
import { sendGlobalMessage } from "../../../../../../utils/messaging";
import { useActiveSection, useSearch } from "../../../../../../context/data.context";
import { FiTrash } from "react-icons/fi";
import {
  GlobalActionTypes,
  LookupResultType
} from "../../../../../../types";
import { ActionIcon, Anchor, Checkbox, Flex, Group, List, Stack, Text, Title } from "@mantine/core";
import useGetHistory from "../../../../../../hooks/useGetHistory";

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function () {
  const { setSearchFor, setResult, setError, setSuggestions } = useSearch();
  const { setActiveSection } = useActiveSection();

  const [history, toggleReview, removeItem] = useGetHistory();
  const [, setLoading] = useState(false);

  const handleReSearch = (searchTrend: string) => {
    setSearchFor(searchTrend);
    setLoading(true);
    setSuggestions([]);
    setResult([]);
    services.fetchData(searchTrend)
      .then(async (res) => {
        if (typeof res[0] !== "string") {
          await sendGlobalMessage({ action: GlobalActionTypes.ADD_TO_HISTORY, data: { searchTrend } });
          setResult(res as LookupResultType);
        }
        setActiveSection("Result");
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const handleHistoryCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    const textToCopy = history.map(([key]) => key).join(", ");
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        (e.target as HTMLButtonElement).innerText = "Copied!";
        (e.target as HTMLButtonElement).disabled = true;
      });
  };

  return (
    <Stack px="sm" gap="xs">
      {!!history && !!history.length
        ? (
            <>
              <Title order={5}>Your lookup history:</Title>
              <Text size="sm">
                Uncheck if you want to exclude phrases from being searched while in review mode.
              </Text>
              <List listStyleType="none">
                {history.map(([key, count, review]) => (
                  <List.Item
                    key={key + count}
                    w="100%"
                    styles={{
                      itemWrapper: {
                        width: "100%"
                      },
                      itemLabel: {
                        width: "100%"
                      }
                    }}
                  >
                    <Group justify="space-between" w="100%">
                      <Flex gap="sm" align="center">
                        <Checkbox
                          size="xs"
                          checked={review}
                          onChange={() => toggleReview(key, !review)}
                        />
                        <Anchor onClick={() => handleReSearch(key)}>{key}</Anchor>
                      </Flex>
                      <Group justify="space-between" gap="sm" className="foo">
                        <small>{count > 1 ? ` [${count} times]` : ""}</small>
                        <ActionIcon
                          size="sm"
                          color="red"
                          title="Remove from history"
                          variant="transparent"
                          onClick={() => removeItem(key)}
                        >
                          <FiTrash />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </List.Item>
                ))}
              </List>
            </>
          )
        : <Text>Your lookup history is empty!</Text>}

      <ActionButtons onHistoryCopy={handleHistoryCopy} />
    </Stack>
  );
};
