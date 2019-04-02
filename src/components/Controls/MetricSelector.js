import React from "react";

const MetricSelector = (props) => {
  const {selectedMetric, onChange} = props;

  const metrics = ["none", "score", "classVisitedNum", "variability"];
  const metricLabels = ["No Sorting", "Incorrect Ratio", "Number of Visited Classes", "Variability"];

  return <div>
    <select value={selectedMetric} onChange={e => {
      const selectedIndex = e.target.selectedIndex;
      if(selectedIndex === -1) {
        onChange("none");
      } else {
        onChange(metrics[selectedIndex]);
      }
    }}>
      {metrics.map((value, valueIndex) =>
        <option key={valueIndex} value={value}>{metricLabels[valueIndex]}</option>
      )}
    </select>
  </div>;
};

export default MetricSelector;