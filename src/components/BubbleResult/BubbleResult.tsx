import BubbleResultItem from "./BubbleResultItem";
import OpenInWebsite from "../../shared/components/OpenInWebsite";
import {FC} from "react";

const BubbleResult: FC<{
  searchFor: string;
  result?: any[];
}> = ({searchFor, result = []}) => (
  <div className="BubbleResult">
    <OpenInWebsite target={searchFor} notSticky/>
    {result.filter(item => item.shortDef).map((item, index) => (
      <BubbleResultItem item={item} key={item.id + index}/>
    ))}
  </div>
)

export default BubbleResult