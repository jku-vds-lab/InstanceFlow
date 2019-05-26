import React from "react";
import {withFlowData} from "../InstanceFlow/FlowDataProvider";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import Input from "@material-ui/core/Input/Input";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";

const ClassViewSelector = (props) => {
  const {classView, setClassView} = props.flowData;

  const views = ["overview", "instances", "dense"];
  const viewLabels = ["Overview", "Instance View", "Dense"];

  return <FormControl fullWidth margin="dense">
    <InputLabel shrink htmlFor="class-view-selector">
      Class View
    </InputLabel>
    <Select
      value={classView}
      onChange={e => setClassView(e.target.value)}
      input={<Input name="age" id="class-view-selector"/>}
      name="classView"
    >
      {views.map((value, valueIndex) =>
        <MenuItem key={valueIndex} value={value}>{viewLabels[valueIndex]}</MenuItem>
      )}
    </Select>
    {/*<FormHelperText></FormHelperText>*/}
  </FormControl>;
};

export default withFlowData(ClassViewSelector);