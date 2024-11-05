import React from "react";
import { useData } from "../../../context/data.context";
import OpenInWebsite from "../../../../../shared/components/OpenInWebsite";
import ActionButtons from "../../../../../shared/components/ActionButtons";
import BubbleResultItem from "../../../../../components/BubbleResult/BubbleResultItem";
import BubbleSuggestionList from "../../../../../components/BubbleResult/BubbleSuggestionList";
import { services } from "../../../../../shared/utils/services";
import { sendGlobalMessage } from "../../../../../shared/utils/messaging";
import { GlobalActionTypes, LookupResult } from "../../../../../types";

const Result = () => {
  const { result, suggestions, searchFor, setSearchFor, setResult, setError } = useData();

  const handleReSearch = (itemToSearchFor: string) => {
    setSearchFor(itemToSearchFor);
    services.fetchData(itemToSearchFor)
      .then(async (res) => {
        await sendGlobalMessage({ action: GlobalActionTypes.ADD_TO_HISTORY, data: { searchTrend: itemToSearchFor } });
        setResult(res as LookupResult);
      })
      .catch(setError);
  };

  if (suggestions?.length) {
    return (
      <>
        <BubbleSuggestionList suggestions={suggestions} searchFor={searchFor} onReSearch={handleReSearch} />
        <ActionButtons />
      </>
    );
  }

  return (
    <div className="Result">
      <OpenInWebsite target={searchFor} />
      {result?.filter(item => item.shortDef).map((item, index) => (
        <BubbleResultItem item={item} key={index} />
      ))}
      <ActionButtons />
    </div>
  );
};

export default Result;
