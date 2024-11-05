import cx from "classnames";
import React, { FC } from "react";

const OpenInWebsite: FC<{
  target: string;
  notSticky?: boolean;
}> = ({ target, notSticky = false }) => {
  return (
    <a
      className={cx("OpenInWebsite", notSticky && "-no-sticky")}
      onClick={() => window.open(`https://www.merriam-webster.com/dictionary/${target}`)}
      target="_blank"
    >
      Open in Merriam-Webster
    </a>
  );
};

export default OpenInWebsite;
