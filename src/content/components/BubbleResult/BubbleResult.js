import BubbleResultItem from "./BubbleResultItem";
import OpenInWebsite from "../../../shared/components/OpenInWebsite";

const BubbleResult = ({searchFor, result = []}) => (
  <div className="BubbleResult">
    <OpenInWebsite target={searchFor} notSticky/>
    {result.filter(item => item.shortDef).map((item, index) => (
      <BubbleResultItem item={item} key={index}/>
    ))}
  </div>
)

export default BubbleResult