import React from "react";
import {withData} from "../DataProvider";

const ClassSelector = (props) => {
  const {labels, classes, setClasses} = props.data;
  return <div>
    <select value={classes} size={labels.length} multiple onChange={e => {
      setClasses(Array.from(e.target.selectedOptions).map(option => parseInt(option.value)));
    }}>
      {labels.map((label, labelIndex) =>
        <option key={labelIndex} value={labelIndex}>{label}</option>
      )}
    </select>
  </div>;

};

export default withData(ClassSelector);