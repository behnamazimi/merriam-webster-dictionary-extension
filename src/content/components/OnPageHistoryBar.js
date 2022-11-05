import {FiX} from "react-icons/fi";

const OnPageHistoryBar = ({items = []}) => {

  return (
    <div className="OnPageHistoryBar">
      <button className="disable" id="disable-review-mode"><FiX/></button>
      <span>History found on this page: </span>
      {items.map((item, key) => (
        <span className="word"
              data-searchfor={item}
              key={key}>{item}</span>
      ))}
    </div>
  )
}

export default OnPageHistoryBar