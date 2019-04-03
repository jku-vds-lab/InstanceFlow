import React from "react";

const MetricSelector = (props) => {
  const {selectedMetric, onChange} = props;

  const metrics = ["none", "score", "classesVisitedNum", "variability"];
  const metricLabels = ["Default", "Incorrect Ratio", "Number of Visited Classes", "Variability"];

  return <select value={selectedMetric} onChange={e => {
    const selectedIndex = e.target.selectedIndex;
    if (selectedIndex === -1) {
      onChange(metrics[0]);
    } else {
      onChange(metrics[selectedIndex]);
    }
  }}>
    {metrics.map((value, valueIndex) =>
      <option key={valueIndex} value={value}>{metricLabels[valueIndex]}</option>
    )}
  </select>;
};

export default MetricSelector;