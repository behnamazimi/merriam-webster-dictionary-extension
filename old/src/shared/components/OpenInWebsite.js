import cx from "classnames";

const OpenInWebsite = ({target, notSticky = false}) => {
  return (
    <a className={cx("OpenInWebsite", notSticky && "-no-sticky")}
       onClick={() => window.open(`https://www.merriam-webster.com/dictionary/${target}`)}
       target="_blank">
      Open in Merriam-Webster
    </a>
  )
}

export default OpenInWebsite