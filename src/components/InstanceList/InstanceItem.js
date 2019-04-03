import React from "react";
import "./InstanceItem.css";
import {withData} from "../DataProvider";

const InstanceItem = (props) => {
  const {instance, epochs} = props;
  const {getLabel, getColor, activateInstances, deactivateInstances} = props.data;

  const distributionPairs = epochs.reduce((acc, curr) => {
    const predicted = curr.classifications[instance.index].predicted;
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
      <img className={`box-img ${instance.active ? "active" : ""}`} src={instance.image} data-id={instance.id}
           alt={`Instance ${instance.id}`}
           onMouseOver={e => {
             if (!instance.clicked)
               activateInstances({lines: true}, instance.id)
           }}
           onMouseOut={e => {
             if (!instance.clicked)
               deactivateInstances(false, instance.id);
           }}
           onClick={e => {
             if (!instance.clicked) {
               activateInstances({clicked: true, lines: true}, instance.id);
             } else {
               activateInstances({clicked: false, lines: false}, instance.id);
             }
           }}/>
    </div>
    <span style={{
      color: getColor(instance.actual)
    }}>{getLabel(instance.actual)}</span>
    <div className="bar-chart-container" style={{
      flex: 2
    }}>
      {distributionPairs.map((pair, i) =>
        <div key={i}
             data-tip={`${pair[1]} ${getLabel(pair[0])}(s)`}
             className="bar-chart"
             style={{
               flex: pair[1],
               //"--box-color": getIncludedOrOtherColor(pair[0])
               "--box-color": getColor(pair[0])
             }}/>
      )}
    </div>
    <span>{instance.classesVisitedNum}</span>
    <span>{instance.variability}</span>
    <span>{instance.score}</span>
  </div>;
};

export default withData(InstanceItem);