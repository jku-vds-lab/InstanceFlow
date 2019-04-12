import React from "react";
import {withFlowData} from "../InstanceFlow/FlowDataProvider";
import MetricSelector from "./MetricSelector";

const SortSelector = (props) => {
  const {sortMetric, setSortMetric} = props.flowData;
  return <MetricSelector selectedMetric={sortMetric} title="Instance Sorting" onChange={metric => {
    setSortMetric(metric);
  }}/>;
};

export default withFlowData(SortSelector);