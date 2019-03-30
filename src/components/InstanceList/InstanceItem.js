import React from "react";
import "./InstanceItem.css";
import {withData} from "../DataProvider";

const InstanceItem = (props) => {
  const {instance, index} = props;
  const {epochs, getLabel, getColor, getIncludedOrOtherColor} = props.data;

  const distributionPairs = epochs.reduce((acc, curr) => {
    const predicted = curr.classifications[index].predicted;
    const lastIndex = acc.length - 1;
    const lastElement = acc[lastIndex];

    if (lastElement !== undefined && predicted === lastElement[0]) {
      lastElement[1]++;
    } else {
      acc.push([predicted, 1]);
    }
    return acc;
  }, []);

  return <div className="instance-detail-row">
    <span>{instance.id}</span>
    <div>
      <img className="box-img" src={instance.image} data-id={instance.id}/>
    </div>
    <span style={{
      color: getColor(instance.actual)
    }}>{getLabel(instance.actual)}</span>
    <div className="bar-chart-container" style={{
      flex: 2
    }}>
      {distributionPairs.map((pair, i) =>
        <div key={i} className="bar-chart tooltip-container" style={{
          flex: pair[1], "--box-color": getIncludedOrOtherColor(pair[0])
        }}>
          <div className="tooltip-text">{pair[1]} {getLabel(pair[0])}(s)</div>
        </div>
      )}
    </div>
    <span>{instance.classesVisitedNum}</span>
    <span>{instance.variability}</span>
    <span>{instance.score}</span>
  </div>;
};

export default withData(InstanceItem);