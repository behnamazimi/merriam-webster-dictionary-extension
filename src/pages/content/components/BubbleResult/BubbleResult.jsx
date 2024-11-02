import BubbleResultItem from "./BubbleResultItem";
import OpenInWebsite from "../../../../shared/components/OpenInWebsite.jsx";

const BubbleResult = ({searchFor, result = []}) => (
  <div className="BubbleResult">
    <OpenInWebsite target={searchFor} notSticky/>
    {result.filter(item => item.shortDef).map((item, index) => (
      <BubbleResultItem item={item} key={item.id + index}/>
    ))}
  </div>
)

export default BubbleResult