import React from "react";
import {withData} from "../DataProvider";
import MetricSelector from "./MetricSelector";

const SortSelector = (props) => {
  const {sortMetric, setSortMetric} = props.data;
  return <MetricSelector selectedMetric={sortMetric} onChange={metric => {
    setSortMetric(metric);
  }}/>;
};

export default withData(SortSelector);