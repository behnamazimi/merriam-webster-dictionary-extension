import React from "react"
import {useData} from "../../../context/data.context";
import ActionButtons from "../../../../shared/components/ActionButtons";
import AskToRate from "../../../../shared/components/AskToRate";
import Input from "../../../../shared/components/Input";
import Button from "../../../../shared/components/Button";
import {FiSearch} from "react-icons/fi";

const SearchSection = () => {
  const {error, doSearch, loading} = useData()

  const handleSearch = (event) => {
    event.preventDefault()
    if (!event.target.searchFor.value) return
    doSearch(event.target.searchFor.value)
  }

  return (
    <div className="Search">

      <form onSubmit={handleSearch}>
        <Input className="input"
               name="searchFor"
               placeholder="Search for..."
               autoFocus/>
        <Button className="primary icon-only"
                disabled={loading}>
          <FiSearch/>
        </Button>
      </form>

      <div className="message">{error}</div>

      <ActionButtons/>

      <div className="footer">
        <AskToRate/>
      </div>

    </div>
  )
}

export default SearchSection