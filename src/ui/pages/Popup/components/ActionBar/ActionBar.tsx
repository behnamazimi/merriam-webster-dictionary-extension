import { useActiveSection, useSearch } from "../../../../../context/data.context";
import { sendGlobalMessage } from "../../../../../utils/messaging";
import { FiCopy, FiArrowLeft, FiSettings } from "react-icons/fi";
import { AiOutlineClear } from "react-icons/ai";
import React, { useCallback } from "react";
import { GlobalActionTypes } from "../../../../../types";
import { ActionIcon, Button, Group } from "@mantine/core";
import { RiHistoryFill } from "react-icons/ri";

type ActionBarProps = {
  onHistoryCopy?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function ({ onHistoryCopy }: ActionBarProps) {
  const { setSearchFor } = useSearch();
  const { activeSection, setActiveSection } = useActiveSection();

  const handleHistoryClear = useCallback(async () => {
    await sendGlobalMessage({ action: GlobalActionTypes.CLEAR_HISTORY });
    setActiveSection("Search");
  }, [setActiveSection]);

  const handleBackClick = useCallback(() => {
    setSearchFor("");
    setActiveSection("Search");
  }, [setSearchFor, setActiveSection]);

  const showBackButton = activeSection !== "Search";
  const showOptionsButton = activeSection === "Search";
  const showHistoryButton = !["History", "Result", "Options"].includes(activeSection);
  const showClearHistoryButton = activeSection === "History";
  const showCopyAllButton = activeSection === "History" && !!onHistoryCopy;

  return (
    <Group gap="xs" pos="sticky" bottom={40}>
      {showBackButton && (
        <ActionIcon onClick={handleBackClick} aria-label="Back">
          <FiArrowLeft size={14} />
        </ActionIcon>
      )}

      {showOptionsButton && (
        <Button
          variant="filled"
          onClick={() => setActiveSection("Options")}
          size="xs"
          leftSection={<FiSettings size={14} />}
        >
          Options
        </Button>
      )}

      {showHistoryButton && (
        <Button
          variant="filled"
          onClick={() => setActiveSection("History")}
          size="xs"
          leftSection={<RiHistoryFill size={14} />}
        >
          History
        </Button>
      )}

      {showCopyAllButton && (
        <Button
          variant="filled"
          onClick={onHistoryCopy}
          size="xs"
          leftSection={<FiCopy size={14} />}
        >
          Copy All
        </Button>
      )}

      {showClearHistoryButton && (
        <Button
          variant="filled"
          color="red"
          onClick={handleHistoryClear}
          size="xs"
          leftSection={<AiOutlineClear size={14} />}
        >
          Clear
        </Button>
      )}
    </Group>
  );
};
