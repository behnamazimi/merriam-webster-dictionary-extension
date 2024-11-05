import React, { FC } from "react";

const BubbleSuggestionList: FC<{
  suggestions?: string[];
  searchFor: string;
  onReSearch: (searchFor: string) => void;
}> = ({ suggestions = [], searchFor = "", onReSearch }) => {
  const shortedSearchFor = searchFor.substring(0, 12);

  return (
    <div className="BubbleSuggestionList">
      <div className="no-result">
        No result for "
        {shortedSearchFor}
        "!
        <br />
        Here are the similar ones to what you're looking for:
      </div>
      <ul>
        {suggestions.map((item, index) => (
          <li key={index}>
            <a onClick={() => onReSearch(item)}>{item}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BubbleSuggestionList;
