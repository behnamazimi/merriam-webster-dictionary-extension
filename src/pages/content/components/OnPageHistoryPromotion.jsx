const OnPageHistoryPromotion = ({historySample = null}) => {

  return (
    <div className="OnPageHistoryPromotion">
      <div className="details">
        <h3 className="title">
          Review your search history!
        </h3>
        <p className="message">
          You've previously searched for the meaning of "<code>{historySample}</code>" found on this page.
        </p>
        <img src="/icons/128.png" className="logo" alt=""/>
      </div>

      <p className="message">
        Do you want to enable review mode, so you can see your relevant history
        in the bottom corner of each page?
      </p>

      <div className="actions">
        <button className="close" id="close-promotion">
          Close
        </button>
        <button id="enable-review-mode">Enable now</button>
      </div>
    </div>
  )
}

export default OnPageHistoryPromotion