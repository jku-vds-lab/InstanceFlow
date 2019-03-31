import React from "react";
import SimpleBox from "../Basic/SimpleBox";
import "./Legend.css"

const Legend = (props) => {
  const {labels, colors} = props;
  return <div>
    {labels.map((label, labelIndex) =>
      <div key={label} className="legend-row">
        <span>{label}</span>
        <div>
          <SimpleBox type="stable" color={colors[labelIndex]}/>
        </div>
      </div>
    )}
  </div>;

};

export default Legend;