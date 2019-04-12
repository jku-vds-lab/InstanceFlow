import React from "react";
import {withFlowData} from "../InstanceFlow/FlowDataProvider";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Switch from "@material-ui/core/Switch/Switch";

const SankeyEnableCheckbox = (props) => {
  const {sankeyEnabled, setSankeyEnabled} = props.flowData;

  return <FormControlLabel
    control={
      <Switch
        color="primary"
        checked={sankeyEnabled}
        onChange={e => setSankeyEnabled(e.target.checked)}
      />
    }
    label="Flow Enable"
  />;
};

export default withFlowData(SankeyEnableCheckbox);