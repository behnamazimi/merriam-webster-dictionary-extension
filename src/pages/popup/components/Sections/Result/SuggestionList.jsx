import {useState} from "react";
import {useData} from "../../../context/data.context";
import {services} from "../../../../../shared/utils/services";
import {sendGlobalMessage} from "../../../../../shared/utils/messaging";
import {globalActions,} from "../../../../../shared/utils/constants";

const SuggestionList = ({suggestions = []}) => {
  const [loading, setLoading] = useState(false)
  const {searchFor, setSearchFor, setResult, setError} = useData()
  if (!suggestions || !suggestions.length) return

  const shortedSearchFor = searchFor.substring(0, 12)

  const handleReSearch = (itemToSearchFor) => {
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

  return (
    <div className="SuggestionList">
      <div className="title">
        No result for "{shortedSearchFor}"!
        <span>Here are the similar ones to what you're looking for:</span>
      </div>
      <ul>
        {suggestions.map((item, index) => (
          <li key={index}>
            <a onClick={() => handleReSearch(item)}>{item}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SuggestionList