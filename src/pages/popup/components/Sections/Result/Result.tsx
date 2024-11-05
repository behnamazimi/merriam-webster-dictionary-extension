import {useData} from "../../../context/data.context";
import OpenInWebsite from "../../../../../shared/components/OpenInWebsite";
import ActionButtons from "../../../../../shared/components/ActionButtons";
import BubbleResultItem from "../../../../../components/BubbleResult/BubbleResultItem";
import BubbleSuggestionList from "../../../../../components/BubbleResult/BubbleSuggestionList";
import {useState} from "react";
import {services} from "../../../../../shared/utils/services";
import {sendGlobalMessage} from "../../../../../shared/utils/messaging";
import {globalActions} from "../../../../../shared/utils/constants";

const Result = () => {
  const {result, suggestions, searchFor, setSearchFor, setResult, setError} = useData()
  const [loading, setLoading] = useState(false)

  const handleReSearch = (itemToSearchFor: string) => {
    setSearchFor(itemToSearchFor);
    setLoading(true)
    services.fetchData(itemToSearchFor)
      .then(async (res) => {
        await sendGlobalMessage({action: globalActions.ADD_TO_HISTORY, searchTrend: itemToSearchFor})
        setResult(res)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }

  if (suggestions?.length) {
    return (
      <>
        <BubbleSuggestionList suggestions={suggestions} searchFor={searchFor} onReSearch={handleReSearch}/>
        <ActionButtons/>
      </>
    )
  }

  return (
    <div className="Result">
      <OpenInWebsite target={searchFor}/>
      {result?.filter(item => item.shortDef).map((item, index) => (
        <BubbleResultItem item={item} key={index}/>
      ))}
      <ActionButtons/>
    </div>
  )
}

export default Result