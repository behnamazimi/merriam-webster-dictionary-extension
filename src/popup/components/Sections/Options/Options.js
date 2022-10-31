import styled from "styled-components";
import {spacings} from "../../../../shared/utils/theme";
import {Alert, Button, Checkbox, Divider, Form, Input, Radio, Select, Space, Typography} from "antd";
import {CloseOutlined, CheckOutlined} from "@ant-design/icons";
import {useData} from "../../../context/data.context";
import {defaultOptions, PAGES, publicApiDetails} from "../../../../shared/utils/constants";
import {useEffect, useRef} from "react";

const StyledRoot = styled.div`
  padding: 56px ${spacings.m} ${spacings.m};

  .guide {
    font-size: 14px;
  }
`

const StyledAlert = styled(Alert)`
  font-size: 14px;

  .ant-alert-message {
    font-size: 14px;
    font-weight: bold;
  }

  .ant-alert-description {
    opacity: 0.9;
  }
`

const StyledActions = styled(Form.Item)`
  position: sticky;
  bottom: 1rem;
  margin: 0;
`

const Options = () => {
  const {options, setActiveSection, setOptions, publicApiUsage} = useData()

  const isUsingFreeApiDetails = options.apiKey === defaultOptions.apiKey
  const isFreeSearchesDone = publicApiUsage >= publicApiDetails.usageLimitPerInstall

  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(options);
  }, [form, options])

  const renderGuide = () => {
    return (
      <Space className="guide" size="small" direction="vertical">
        <Typography.Text type="warning">READ THIS GUIDE FIRST</Typography.Text>
        <Typography.Text type="secondary">
          This extension uses Merriam-Webster's free services. You can {" "}
          <a href="https://dictionaryapi.com/register/index" target="_blank">do free register here</a> to
          get your personal API key. Then you need to put it below in the form to be able to use the extension.
        </Typography.Text>

        <Typography.Text type="secondary">
          Notice that there are different types of APIs and each has its unique key. In the form below, you
          should choose the one which you choose on registration.
        </Typography.Text>
        <Typography.Text type="secondary">
          If you don't know which dictionary fits your needs, you can {" "}
          <a href="https://dictionaryapi.com/products/index" target="_blank">read their details here</a>.
        </Typography.Text>

        {isUsingFreeApiDetails && !isFreeSearchesDone &&
          <StyledAlert
            message={`${publicApiUsage} out of ${publicApiDetails.usageLimitPerInstall} free searches have been consumed!`}
            description="Don't forget to add your personal API options."
            type="warning" size="small"/>}

        {isUsingFreeApiDetails && isFreeSearchesDone &&
          <StyledAlert message={`Free searches have been consumed!`}
                       description="You've reached the limit of using public options. You need to add you FREE personal API key to continue using this extension."
                       type="warning" size="small"/>}
        <Divider/>

      </Space>
    )
  }

  const onFinish = (values) => {
    setOptions(values)
    setActiveSection(PAGES.Search)
  };

  return (
    <StyledRoot>
      {renderGuide()}

      <Form
        form={form}
        name="options"
        layout="vertical"
        labelCol={{span: 24}}
        wrapperCol={{span: 24}}
        onFinish={onFinish}
      >
        <Form.Item label="API key" name="apiKey"
                   tooltip="Enter your dictionary API key">
          <Input placeholder="6b3a80cc-9d9f-4007-9ee5-52a24ab7eb43"/>
        </Form.Item>
        <Form.Item name="apiType" label="API type">
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            <Select.Option value="">--</Select.Option>
            <Select.Option value="collegiate">Collegiate Dictionary</Select.Option>
            <Select.Option value="thesaurus">Collegiate Thesaurus</Select.Option>
            <Select.Option value="ithesaurus">Intermediate Thesaurus</Select.Option>
            <Select.Option value="spanish">Spanish-English Dictionary</Select.Option>
            <Select.Option value="medical">Medical Dictionary</Select.Option>
            <Select.Option value="sd2">Elementary Dictionary</Select.Option>
            <Select.Option value="sd3">Intermediate Dictionary</Select.Option>
            <Select.Option value="sd4">School Dictionary</Select.Option>
            <Select.Option value="learners">Learners Dictionary</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="onWordSelect"
                   valuePropName="value"
                   label="When I select a word or phrase:">
          <Radio.Group>
            <Radio>
              Do nothing
            </Radio>
            <Radio value="OPEN_IMMEDIATELY">
              Open the result immediately next to the word I selected
            </Radio>
            <Radio value="OPEN_WITH_BUTTON">
              Display a button that I can click to open the result next to the word I selected
            </Radio>
            <Radio value="OPEN_ON_WEBSITE">
              Display a button that I can click to open the result on Merriam-Webster's website
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="pauseVideoOnPopupOpen" valuePropName="checked">
          <Checkbox>
            Pause the video playing on the page while searching and resume when the pop-up closes
          </Checkbox>
        </Form.Item>
        <StyledActions style={{textAlign: "right"}}>
          <Space>
            <Button type="danger" icon={<CloseOutlined/>}
                    onClick={() => setActiveSection(PAGES.Search)}/>
            <Button type="primary" htmlType="submit" icon={<CheckOutlined/>}>Save</Button>
          </Space>
        </StyledActions>
      </Form>
    </StyledRoot>
  )
}

export default Options