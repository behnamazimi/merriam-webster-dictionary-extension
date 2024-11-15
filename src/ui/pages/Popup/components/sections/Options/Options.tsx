import React, { useEffect, useState } from "react";
import { useOptions } from "../../../../../../context/data.context";
import {
  TextInput,
  Select,
  Radio,
  CheckIcon,
  Stack,
  Text,
  Divider, Switch, useMantineColorScheme, Group, ActionIcon, Button
} from "@mantine/core";
import { OptionsType } from "../../../../../../types";
import ApiKeyGuide from "../../ApiKeyGuide/ApiKeyGuide";
import ActionButtons from "../../ActionBar";
import { FiMoon, FiSun } from "react-icons/fi";
import { defaultOptions } from "../../../../../../constants/constants";

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function () {
  const { options, setOptions } = useOptions();

  const { colorScheme, setColorScheme } = useMantineColorScheme();

  // Typing fields with the OptionsState type
  const [fields, setFields] = useState<Partial<OptionsType>>({
    apiKey: "",
    apiType: defaultOptions.apiType,
    wordSelectMode: "",
    pauseVideoOnPopupOpen: false,
    reviewMode: false,
    theme: "dark",
    textSize: "16px"
  });

  useEffect(() => {
    if (options) {
      setFields(options);
    }
  }, [options]);

  // Update fields and sync with the context
  const updateFields = (key: keyof OptionsType, value: string | boolean) => {
    setFields((prev) => {
      const updatedFields = { ...prev, [key]: value };

      if (key === "apiKey" && value === "") {
        updatedFields.apiKey = defaultOptions.apiKey;
      }

      setOptions(updatedFields as OptionsType); // Sync with the context
      return updatedFields;
    });
  };

  return (
    <Stack px="sm">
      <ApiKeyGuide />

      <form onSubmit={e => e.preventDefault()}>
        <Stack>
          {/* API Key */}
          <TextInput
            label="API key"
            name="apiKey"
            placeholder="6b3a80cc-9d9f-4007-9ee5-52a24ab7eb43"
            value={fields.apiKey === defaultOptions.apiKey ? "" : fields.apiKey}
            onChange={e => updateFields("apiKey", e.target.value)}
          />

          {/* API Type Select */}
          <Select
            name="apiType"
            label="API type"
            value={fields.apiType}
            onChange={val => updateFields("apiType", val || "")}
            data={[
              { value: "collegiate", label: "Collegiate Dictionary" },
              { value: "thesaurus", label: "Collegiate Thesaurus" },
              { value: "ithesaurus", label: "Intermediate Thesaurus" },
              { value: "spanish", label: "Spanish-English Dictionary" },
              { value: "medical", label: "Medical Dictionary" },
              { value: "sd2", label: "Elementary Dictionary" },
              { value: "sd3", label: "Intermediate Dictionary" },
              { value: "sd4", label: "School Dictionary" },
              { value: "learners", label: "Learners Dictionary" }
            ]}
          />

          <Divider />

          {/* Word Select Mode */}
          <Stack gap="xs">
            <Text>When I select a word or phrase:</Text>
            <Radio
              icon={CheckIcon}
              name="wordSelectMode"
              label="Take no action"
              checked={!fields.wordSelectMode}
              onChange={() => updateFields("wordSelectMode", "")}
            />
            <Radio
              icon={CheckIcon}
              name="wordSelectMode"
              value="OPEN_IMMEDIATELY"
              label="Show definition immediately next to the selected text"
              checked={fields.wordSelectMode === "OPEN_IMMEDIATELY"}
              onChange={e => updateFields("wordSelectMode", e.target.value)}
            />
            <Radio
              icon={CheckIcon}
              name="wordSelectMode"
              value="OPEN_POPUP"
              label="Show a button to open the definition in the extension popup (top-right corner)"
              checked={fields.wordSelectMode === "OPEN_POPUP"}
              onChange={e => updateFields("wordSelectMode", e.target.value)}
            />
            <Radio
              icon={CheckIcon}
              name="wordSelectMode"
              value="OPEN_WITH_BUTTON"
              label="Show a button to open the definition next to the selected text"
              checked={fields.wordSelectMode === "OPEN_WITH_BUTTON"}
              onChange={e => updateFields("wordSelectMode", e.target.value)}
            />
            <Radio
              icon={CheckIcon}
              name="wordSelectMode"
              value="OPEN_ON_WEBSITE"
              label="Show a button to open the definition on Merriam-Webster's website"
              checked={fields.wordSelectMode === "OPEN_ON_WEBSITE"}
              onChange={e => updateFields("wordSelectMode", e.target.value)}
            />
          </Stack>

          <Divider />

          {/* Pause Video On Popup Open */}
          <Switch
            radius="md"
            name="pauseVideoOnPopupOpen"
            label="Pause video playback during search, and resume when the extension popup closes"
            checked={fields.pauseVideoOnPopupOpen}
            onChange={e => updateFields("pauseVideoOnPopupOpen", e.target.checked)}
          />

          {/* Review Mode */}
          <Switch
            radius="md"
            name="reviewMode"
            label="Enable review mode to show the lookup history for words found on each page in the bottom corner"
            checked={fields.reviewMode}
            onChange={e => updateFields("reviewMode", e.target.checked)}
          />
          <Divider />

          <Group gap="xs">
            <Text>Theme:</Text>
            <Button
              size="xs"
              variant={colorScheme === "auto" ? "filled" : "outline"}
              onClick={() => {
                setColorScheme("auto");
                updateFields("theme", "auto");
              }}
            >
              Auto
            </Button>
            <ActionIcon
              variant={colorScheme === "light" ? "filled" : "outline"}
              onClick={() => {
                setColorScheme("light");
                updateFields("theme", "light");
              }}
            >
              <FiSun />
            </ActionIcon>
            <ActionIcon
              variant={colorScheme === "dark" ? "filled" : "outline"}
              onClick={() => {
                setColorScheme("dark");
                updateFields("theme", "dark");
              }}
            >
              <FiMoon />
            </ActionIcon>
          </Group>

          <Group gap="xs">
            <Text>Text size:</Text>
            <Button
              size="xs"
              variant={fields.textSize === "16px" ? "filled" : "outline"}
              onClick={() => {
                document.documentElement.style.fontSize = "16px";
                updateFields("textSize", "16px");
              }}
            >
              <Text size="sm">Aa</Text>
            </Button>
            <Button
              size="xs"
              variant={fields.textSize === "18px" ? "filled" : "outline"}
              onClick={() => {
                document.documentElement.style.fontSize = "18px";
                updateFields("textSize", "18px");
              }}
            >
              <Text size="lg" fw="bold">Aa</Text>
            </Button>
          </Group>

        </Stack>
      </form>

      <ActionButtons />
    </Stack>
  );
};
