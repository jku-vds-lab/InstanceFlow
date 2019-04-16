import React from "react";
import MetricSelector from "./MetricSelector";
import {withData} from "../DataProvider";

const SortSelector = (props) => {
  const {sortMetric, setSortMetric} = props.data;
  return <MetricSelector selectedMetric={sortMetric} title="Instance Sorting" onChange={metric => {
    setSortMetric(metric);
  }}/>;
};

export default withData(SortSelector);