import { FiVolume2 } from "react-icons/fi";
import React, { FC } from "react";
import { LookupResultItem } from "../../types";

const ResultItemTitle: FC<{
  item: LookupResultItem;
}> = ({ item }) => {
  const [id, num] = item.id.split(":");
  return (
    <summary className="ResultItemTitle">
      {!!num && (
        <span>
          {num}
          :
        </span>
      )}
      <strong>{id}</strong>
      <small>{item.type}</small>
    </summary>
  );
};

const Pron: FC<{
  item: LookupResultItem;
}> = ({ item }) => {
  const handlePronPlay = () => {
    if (item.sound) {
      new Audio(item.sound).play();
    }
  };

  if (!item.pron) {
    return null;
  }

  return (
    <div className="Pron" onClick={handlePronPlay}>
      <span>{item.pron}</span>
      <FiVolume2 />
    </div>
  );
};

const BubbleResultItem: FC<{
  item: LookupResultItem;
}> = ({ item }) => {
  return (
    <details className="BubbleResultItem" open>
      <ResultItemTitle item={item} />
      {!!item.pron && <Pron item={item} />}
      {!!item.synonyms
      && (
        <p className="syn">
          Synonyms:
          {item.synonyms.join(", ")}
        </p>
      )}
      <ul className="defs">
        {item.shortDef.map((d: string, index: number) => (
          <li key={index}>{d}</li>
        ))}
      </ul>

      {!!item.examples
      && (
        <ul className="examples">
          {item.examples.map((ex: string, index: number) => (
            <li
              key={index}
              dangerouslySetInnerHTML={{
                __html: ">> " + ex
                  .replaceAll("{it}", "<strong>").replaceAll("{/it}", "</strong>")
                  .replaceAll("{wi}", "<strong>").replaceAll("{/wi}", "</strong>")
              }}
            />
          ))}
        </ul>
      )}
    </details>
  );
};

export default BubbleResultItem;
