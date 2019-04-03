import React from "react";
import SimpleBox from "../Basic/SimpleBox";
import "./Legend.css"

const Legend = (props) => {
  const {labels, colors, showTypes} = props;
  return <div style={{display: "flex"}}>
    <div>
      {labels.map((label, labelIndex) =>
        <div key={label} className="legend-row">
          <span>{label}</span>
          <div>
            <SimpleBox type="stable" color={colors[labelIndex]}/>
          </div>
        </div>
      )}
    </div>
    {showTypes && <div>
      {["in", "stable", "inout", "out"].map(type =>
        <div key={type} className="legend-row">
          <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          <div>
            <SimpleBox type={type} color="green"/>
          </div>
        </div>
      )}
    </div>}
  </div>;

};

export default Legend;