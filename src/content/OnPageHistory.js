import {useLayoutEffect} from "react";
import cx from "classnames";
import styles from "./OnPageHistory.styles.js"
import OnPageHistoryPromotion from "./components/OnPageHistoryPromotion";
import OnPageHistoryBar from "./components/OnPageHistoryBar";

const OnPageHistory = ({items = [], promote}) => {

  // add styles to shadow root
  useLayoutEffect(() => {
    const stylesElm = document.createElement("style")
    stylesElm.innerHTML = styles
    document.getElementById("mw-dic-history").shadowRoot.appendChild(stylesElm)
  }, [])

  return (
    <div className={cx("OnPageHistory")}>
      {promote ? (
        <OnPageHistoryPromotion historySample={items[0]}/>
      ) : (
        <OnPageHistoryBar items={items}/>
      )}
    </div>
  )
}

export default OnPageHistory