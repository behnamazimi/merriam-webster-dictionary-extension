import {REVIEW_US} from "../utils/constants";
import cx from "classnames";
import {useData} from "../../popup/context/data.context";

const AskToRate = () => {
  const {reviewLinksClicksCount, countUpReviewLinksClicks} = useData()

  // show until 2 clicks
  const visible = reviewLinksClicksCount < 2
  if (!visible) return null

  const randomText = REVIEW_US[Math.floor(Math.random() * REVIEW_US.length)];

  const handleOnClick = () => countUpReviewLinksClicks()

  return (
    <div className={cx("AskToRate", visible && "visible")}>
      <a href="https://bit.ly/rate-mwd" target="_blank"
         onClick={handleOnClick}>
        {randomText}
      </a>
    </div>
  )
}

export default AskToRate
