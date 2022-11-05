import {useData} from "../../../context/data.context";
import {defaultOptions, PAGES, publicApiDetails} from "../../../../shared/utils/constants";
import {useEffect, useRef, useState} from "react";
import Input from "../../../../shared/components/Input";
import Select from "../../../../shared/components/Select";
import Button from "../../../../shared/components/Button";
import {FiCheck, FiX} from "react-icons/fi";

const Divider = () => <div className="Divider"/>

const Alert = ({header, message}) => {
  return (
    <div className="Alert -warning">
      <div className="header">{header}</div>
      <div className="message">{message}</div>
    </div>
  )
}

const Options = () => {
  const {options, setActiveSection, setOptions, publicApiUsage} = useData()

  const isUsingFreeApiDetails = options.apiKey === defaultOptions.apiKey
  const isFreeSearchesDone = publicApiUsage >= publicApiDetails.usageLimitPerInstall

  const formRef = useRef(null)
  const [fields, setFields] = useState({})

  useEffect(() => {
    setFields(options)
  }, [options])

  const updateFields = (key, value) => {
    setFields(st => ({...st, [key]: value}))
  }

  const renderGuide = () => {
    return (
      <div className="guide">
        <div className="title">READ THIS GUIDE FIRST</div>
        <p>
          This extension uses Merriam-Webster's free services. You can {" "}
          <a href="https://dictionaryapi.com/register/index" target="_blank">do free register here</a> to
          get your personal API key. Then you need to put it below in the form to be able to use the extension.
        </p>

        <p>
          Notice that there are different types of APIs and each has its unique key. In the form below, you
          should choose the one which you choose on registration.
        </p>
        <p>
          If you don't know which dictionary fits your needs, you can {" "}
          <a href="https://dictionaryapi.com/products/index" target="_blank">read their details here</a>.
        </p>

        {isUsingFreeApiDetails && !isFreeSearchesDone &&
          <Alert
            header={`${publicApiUsage} out of ${publicApiDetails.usageLimitPerInstall} free searches have been consumed!`}
            message={"Don't forget to add your personal API options."}/>}

        {isUsingFreeApiDetails && isFreeSearchesDone &&
          <Alert header={`Free searches have been consumed!`}
                 message="You've reached the limit of using public options. You need to add you FREE personal API key to continue using this extension."/>}
        <Divider/>

      </div>
    )
  }

  const onFinish = (e) => {
    e.preventDefault()

    const values = {
      apiKey: formRef.current.apiKey.value,
      apiType: formRef.current.apiType.value,
      pauseVideoOnPopupOpen: formRef.current.pauseVideoOnPopupOpen.checked,
      wordSelectMode: formRef.current.wordSelectMode.value,
      reviewMode: formRef.current.reviewMode.checked,
    }

    setOptions(values)
    setActiveSection(PAGES.Search)
  };

  return (
    <div className="Options">
      {renderGuide()}

      <form onSubmit={onFinish} ref={formRef}>
        <Input label="API key" name="apiKey"
               placeholder="6b3a80cc-9d9f-4007-9ee5-52a24ab7eb43"
               value={fields.apiKey}
               onChange={e => updateFields("apiKey", e.target.value)}/>

        <Select name="apiType"
                label="API type"
                value={fields.apiType}
                onChange={e => updateFields("apiType", e.target.value)}>
          <option value="">Select your API type</option>
          <option value="collegiate">Collegiate Dictionary</option>
          <option value="thesaurus">Collegiate Thesaurus</option>
          <option value="ithesaurus">Intermediate Thesaurus</option>
          <option value="spanish">Spanish-English Dictionary</option>
          <option value="medical">Medical Dictionary</option>
          <option value="sd2">Elementary Dictionary</option>
          <option value="sd3">Intermediate Dictionary</option>
          <option value="sd4">School Dictionary</option>
          <option value="learners">Learners Dictionary</option>
        </Select>

        <Divider/>
        <div className="radio-group">
          <label>When I select a word or phrase:</label>
          <div>
            <Input type="radio"
                   name="wordSelectMode"
                   label="Do nothing"
                   checked={fields.wordSelectMode === ""}
                   onChange={e => updateFields("wordSelectMode", "")}/>
            <Input type="radio"
                   name="wordSelectMode"
                   value="OPEN_IMMEDIATELY"
                   label="Open the result immediately next to the word I selected"
                   checked={fields.wordSelectMode === "OPEN_IMMEDIATELY"}
                   onChange={e => updateFields("wordSelectMode", e.target.value)}/>
            <Input type="radio"
                   name="wordSelectMode"
                   value="OPEN_WITH_BUTTON"
                   label="Display a button that I can click to open the result next to the word I selected"
                   checked={fields.wordSelectMode === "OPEN_WITH_BUTTON"}
                   onChange={e => updateFields("wordSelectMode", e.target.value)}/>
            <Input type="radio"
                   name="wordSelectMode"
                   value="OPEN_ON_WEBSITE"
                   label="Display a button that I can click to open the result on Merriam-Webster's website"
                   checked={fields.wordSelectMode === "OPEN_ON_WEBSITE"}
                   onChange={e => updateFields("wordSelectMode", e.target.value)}/>
          </div>
        </div>
        <Input type="checkbox" name="pauseVideoOnPopupOpen"
               label="Pause the video playing on the page while searching and resume when the pop-up closes"
               checked={fields.pauseVideoOnPopupOpen}
               onChange={e => updateFields("pauseVideoOnPopupOpen", e.target.checked)}/>

        <Input type="checkbox" name="reviewMode"
               label="Enable review mode so the relevant history will be shown in the bottom corner of each page"
               checked={fields.reviewMode}
               onChange={e => updateFields("reviewMode", e.target.checked)}/>

        <div className="actions">
          <Button className="error icon-only"
                  onClick={() => setActiveSection(PAGES.Search)}>
            <FiX/>
          </Button>
          <Button className="primary icon" type="submit">
            <FiCheck/>Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Options