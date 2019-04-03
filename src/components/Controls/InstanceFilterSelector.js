import React from "react";
import {withData} from "../DataProvider";

const InstanceFilterSelector = (props) => {
  const {instanceFilter, setInstanceFilter} = props.data;

  const metrics = ["incorrect", "active", "all"];
  const metricLabels = ["Only Incorrect", "Active Instances", "All Instances"];

  return <select value={instanceFilter} onChange={e => {
    const selectedIndex = e.target.selectedIndex;
    if (selectedIndex === -1) {
      setInstanceFilter(metrics[0]);
    } else {
      setInstanceFilter(metrics[selectedIndex]);
    }
  }}>
    {metrics.map((value, valueIndex) =>
      <option key={valueIndex} value={value}>{metricLabels[valueIndex]}</option>
    )}
  </select>;
};

export default withData(InstanceFilterSelector);