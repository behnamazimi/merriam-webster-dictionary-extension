import BubbleResultItem from "./BubbleResultItem";
import OpenInWebsite from "../../shared/components/OpenInWebsite";
import React, { FC } from "react";
import { LookupResult } from "../../types";

const BubbleResult: FC<{
  searchFor: string;
  result?: LookupResult;
}> = ({ searchFor, result = [] }) => (
  <div className="BubbleResult">
    <OpenInWebsite target={searchFor} notSticky />
    {result.filter(item => item.shortDef).map((item, index) => (
      <BubbleResultItem item={item} key={item.id + index} />
    ))}
  </div>
);

export default BubbleResult;
