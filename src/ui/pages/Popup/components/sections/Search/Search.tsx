import React from "react";
import ActionButtons from "../../ActionBar/ActionBar";
import { useSearch, useOptions, useActiveSection } from "../../../../../../context/data.context";
import { ActionIcon, Alert, Anchor, Stack, Text, TextInput } from "@mantine/core";
import { FiSearch } from "react-icons/fi";
import { defaultOptions } from "../../../../../../constants/constants";

type FormElements = HTMLFormControlsCollection & {
  searchFor: HTMLInputElement;
};

type SearchFormElement = HTMLFormElement & {
  elements: FormElements;
};

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function () {
  const { error, doSearch, loading, setError } = useSearch();
  const { options } = useOptions();
  const { setActiveSection } = useActiveSection();

  const handleSearch = (event: React.FormEvent<SearchFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.elements.searchFor.value) return;
    doSearch(form.elements.searchFor.value);
  };

  return (
    <Stack px="sm">
      <form onSubmit={handleSearch}>
        <TextInput
          name="searchFor"
          placeholder="Search for..."
          autoFocus
          data-focus
          rightSectionPointerEvents="all"
          error={error}
          onChange={() => setError(null)}
          rightSection={(
            <ActionIcon
              type="submit"
              loading={loading}
            >
              <FiSearch />
            </ActionIcon>
          )}
        />
      </form>

      {(options?.apiKey == defaultOptions.apiKey) && (
        <Alert variant="light" color="cyan">
          <Text size="sm">You're currently using default keys, which are limited to allow all users to try out the service.</Text>
          <Anchor size="sm" onClick={() => { setActiveSection("Options"); }}>
            Read how to get your API key. It's FREE!
          </Anchor>
        </Alert>
      )}

      <ActionButtons />
    </Stack>
  );
};
