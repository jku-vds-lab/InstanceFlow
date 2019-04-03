import React from "react";
import {withFlowData} from "../InstanceFlow/FlowDataProvider";

const ClassViewSelector = (props) => {
  const {classView, setClassView} = props.flowData;

  const views = ["overview", "instances"];
  const viewLabels = ["Overview", "Instance View"];

  return <select value={classView} onChange={e => {
    const selectedIndex = e.target.selectedIndex;
    if (selectedIndex === -1) {
      setClassView(views[0]);
    } else {
      setClassView(views[selectedIndex]);
    }
  }}>
    {views.map((value, valueIndex) =>
      <option key={valueIndex} value={value}>{viewLabels[valueIndex]}</option>
    )}
  </select>;
};

export default withFlowData(ClassViewSelector);