import {REVIEW_US} from "../utils/constants";
import cx from "classnames";
import {useData} from "../../popup/context/data.context";
import {FiStar} from "react-icons/fi";

const AskToRate = () => {
  const {reviewLinksClicksCount, countUpReviewLinksClicks} = useData()

  // show until 2 clicks
  const visible = reviewLinksClicksCount < 2
  if (!visible) return null

  let reviewText = "Give us stars"
  const randomText = REVIEW_US[Math.floor(Math.random() * REVIEW_US.length)];

  if (Math.random() > 0.9) {
    reviewText = randomText
  }

  const handleOnClick = () => countUpReviewLinksClicks()

  return (
    <div className="AskToRate">
      {reviewText}

      <a href="https://bit.ly/rate-mwd" target="_blank"
         onClick={handleOnClick}>
          <span>
            <FiStar/>
            <FiStar/>
            <FiStar/>
            <FiStar/>
            <FiStar/>
        </span>
      </a>
    </div>
  )
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
