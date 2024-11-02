import {useData} from "../../../context/data.context";
import ResultItem from "./ResultItem";
import OpenInWebsite from "../../../../../shared/components/OpenInWebsite";
import ActionButtons from "../../../../../shared/components/ActionButtons";
import SuggestionList from "./SuggestionList";

const Result = () => {
  const {result, searchFor} = useData()

  if (result?.length && typeof result[0] === "string") {
    return (
      <>
        <SuggestionList suggestions={result}/>
        <ActionButtons/>
      </>
    )
  }

  return (
    <div className="Result">
      <OpenInWebsite target={searchFor}/>
      {result.filter(item => item.shortDef).map((item, index) => (
        <ResultItem item={item} key={index}/>
      ))}
      <ActionButtons/>
    </div>
  )
}

export default Result