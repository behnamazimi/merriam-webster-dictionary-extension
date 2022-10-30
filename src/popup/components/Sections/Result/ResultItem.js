import {Collapse, Typography} from "antd";
import styled from "styled-components";
import {publicApiDetails} from "../../../../shared/utils/constants";
import {colors, spacings} from "../../../../shared/utils/theme";
import {
  SoundOutlined,
} from '@ant-design/icons';

const StyledTitle = styled.summary`
  padding: 5px;
  margin-bottom: ${spacings.s};
  background: ${colors.mainLight};
  position: relative;
  cursor: pointer;

  span, strong {
    margin-left: ${spacings.s};
  }

  small {
    display: inline-block;
    position: absolute;
    right: ${spacings.s};
  }
`

const Title = ({item}) => {
  const [id, num] = item.id.split(":")
  return (
    <StyledTitle>
      {!!num && <span>{num}:</span>}
      <strong>{id}</strong>
      <small>{item.type}</small>
    </StyledTitle>
  )
}

const StyledPron = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  margin: 8px 12px;
  padding: 1px 3px;
  line-height: 1;
  opacity: 0.6;

  &:hover {
    font-weight: bold;
    opacity: 1;
  }

  span {
    display: inline-block;
    margin-right: ${spacings.s};
  }
`

const Pron = ({item}) => {

  const handlePronPlay = () => {
    new Audio(item.sound).play()
  }

  return (
    <StyledPron onClick={handlePronPlay}>
      <span>{item.pron}</span>
      <SoundOutlined/>
    </StyledPron>
  )
}


const StyledResultItem = styled.details`
  margin-bottom: ${spacings.s};
  color: ${colors.text};

  .syn {
    margin: ${spacings.s} 0 0;
    line-height: 1.3;
  }

  ul {
    padding-left: ${spacings.l};

    li {
      margin-top: 5px;
    }
  }

  .syn {
    opacity: 0.7;
    font-size: 14px;
    white-space: break-spaces;
  }

  .examples {
    list-style: none;
    padding-left: ${spacings.m};
    white-space: break-spaces;
    font-size: 14px;
    color: ${colors.textDark};
  }
`

const ResultItem = ({item}) => {

  return (
    <StyledResultItem open>
      <Title item={item}/>
      {!!item.pron && <Pron item={item}/>}
      {!!item.synonyms &&
        <p className="syn">Synonyms: {item.synonyms.join(", ")}</p>
      }
      <ul className="defs">
        {item.shortDef.map((d => (
          <li>{d}</li>
        )))}
      </ul>

      {!!item.examples &&
        <ul className="examples">
          {item.examples.map(ex => (
            <li dangerouslySetInnerHTML={{
              __html: ">> " + ex
                .replaceAll("{it}", "<strong>").replaceAll("{/it}", "</strong>")
                .replaceAll("{wi}", "<strong>").replaceAll("{/wi}", "</strong>")
            }}/>
          ))}
        </ul>
      }
    </StyledResultItem>
  )
}


export default ResultItem