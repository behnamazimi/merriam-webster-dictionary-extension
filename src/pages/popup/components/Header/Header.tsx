import {AiFillGithub} from "react-icons/ai";

const Header = () => {
  return (
    <div className="Header">
      <a className="brand" href="https://www.merriam-webster.com/" target="_blank">Merriam-Webster' dictionary</a>
      <a className="github" href="https://github.com/behnamazimi/merriam-webster-dictionary-extension" target="_blank">
        <AiFillGithub/>
        Github
      </a>
    </div>
  )
}

export default Header