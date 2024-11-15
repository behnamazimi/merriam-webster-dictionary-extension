import React from "react";
import ActionButtons from "../../ActionBar/ActionBar";
import { services } from "../../../../../../utils/services";
import { sendGlobalMessage } from "../../../../../../utils/messaging";
import { GlobalActionTypes, LookupResultType } from "../../../../../../types";
import { useActiveSection, useSearch } from "../../../../../../context/data.context";
import { Stack } from "@mantine/core";
import LookupResult from "../../../../../components/LookupResult/LookupResult";
import LookupResultSuggestions from "../../../../../components/LookupResult/LookupResultSuggestions";

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function () {
  const { result, suggestions, searchFor, setSearchFor, setResult, setError, setSuggestions } = useSearch();
  const { setActiveSection } = useActiveSection();

  const handleReSearch = (itemToSearchFor: string) => {
    setSearchFor(itemToSearchFor);
    setError(null);
    setSuggestions([]);
    setResult([]);
    services.fetchData(itemToSearchFor)
      .then(async (res) => {
        if (typeof res[0] !== "string") {
          await sendGlobalMessage({ action: GlobalActionTypes.ADD_TO_HISTORY, data: { searchTrend: itemToSearchFor } });
          setResult(res as LookupResultType);
          setActiveSection("Result");
        }
        else {
          setSuggestions(res as string[]);
        }
      })
      .catch(setError);
  };

  if (result?.length) {
    return (
      <Stack px="sm">
        <LookupResult searchFor={searchFor} result={result} />
        <ActionButtons />
      </Stack>
    );
  }

  if (suggestions.length) {
    return (
      <Stack px="sm">
        <LookupResultSuggestions suggestions={suggestions} searchFor={searchFor} onReSearch={handleReSearch} />
        <ActionButtons />
      </Stack>
    );
  }

  return <React.Fragment />;
};
