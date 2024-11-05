import React from "react";
import { AiFillGithub } from "react-icons/ai";

const Header = () => {
  return (
    <div className="Header">
      <a className="brand" href="https://www.merriam-webster.com/" target="_blank" rel="noreferrer">Merriam-Webster' dictionary</a>
      <a className="github" href="https://github.com/behnamazimi/merriam-webster-dictionary-extension" target="_blank" rel="noreferrer">
        <AiFillGithub />
        Github
      </a>
    </div>
  );
};

export default Header;
