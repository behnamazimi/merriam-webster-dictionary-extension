import {FiVolume2} from "react-icons/all";

const ResultItemTitle = ({item}) => {
  const [id, num] = item.id.split(":")
  return (
    <summary className="ResultItemTitle">
      {!!num && <span>{num}:</span>}
      <strong>{id}</strong>
      <small>{item.type}</small>
    </summary>
  )
}

const Pron = ({item}) => {

  const handlePronPlay = () => {
    new Audio(item.sound).play()
  }

  return (
    <div className="Pron" onClick={handlePronPlay}>
      <span>{item.pron}</span>
      <FiVolume2/>
    </div>
  )
}

const BubbleResultItem = ({item}) => {

  return (
    <details className="BubbleResultItem" open>
      <ResultItemTitle item={item}/>
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
          {item.examples.map((ex, index) => (
            <li key={index} dangerouslySetInnerHTML={{
              __html: ">> " + ex
                .replaceAll("{it}", "<strong>").replaceAll("{/it}", "</strong>")
                .replaceAll("{wi}", "<strong>").replaceAll("{/wi}", "</strong>")
            }}/>
          ))}
        </ul>
      }
    </details>
  )
}


export default BubbleResultItem