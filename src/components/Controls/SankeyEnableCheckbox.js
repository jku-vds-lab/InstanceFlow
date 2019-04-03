import React from "react";
import {withFlowData} from "../InstanceFlow/FlowDataProvider";

const SankeyEnableCheckbox = (props) => {
  const {sankeyEnabled, setSankeyEnabled} = props.flowData;

  return <div>
    <input type="checkbox"
           id="sankeyEnableCheckbox"
           checked={sankeyEnabled}
           onChange={e => setSankeyEnabled(e.target.checked)} />
    <label htmlFor="sankeyEnableCheckbox">Flow Enable</label>
  </div>;
};

export default withFlowData(SankeyEnableCheckbox);