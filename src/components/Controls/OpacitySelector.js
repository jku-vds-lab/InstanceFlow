import React from "react";
import {withData} from "../DataProvider";
import MetricSelector from "./MetricSelector";

const OpacityMetric = (props) => {
  const {opacityMetric, setOpacityMetric} = props.data;
  return <MetricSelector selectedMetric={opacityMetric} onChange={metric => {
    setOpacityMetric(metric);
  }}/>;
};

export default withData(OpacityMetric);