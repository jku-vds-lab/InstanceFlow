import React from "react";
import {withData} from "../DataProvider";
import FormControl from "@material-ui/core/FormControl/FormControl";
import Select from "@material-ui/core/Select/Select";
import Input from "@material-ui/core/Input/Input";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";

const InstanceFilterSelector = (props) => {
  const {instanceFilter, setInstanceFilter} = props.data;

  const metrics = ["incorrect", "active", "all"];
  const metricLabels = ["Only Incorrect", "Active Instances", "All Instances"];

  return <FormControl margin="normal" fullWidth>
    <InputLabel shrink htmlFor="instance-filter-selector">
      Instance Filter
    </InputLabel>
    <Select
      value={instanceFilter}
      onChange={e => setInstanceFilter(e.target.value)}
      input={<Input name="age" id="instance-filter-selector"/>}
      name="classView"
    >
      {metrics.map((value, valueIndex) =>
        <MenuItem key={valueIndex} value={value}>{metricLabels[valueIndex]}</MenuItem>
      )}
    </Select>
    <FormHelperText></FormHelperText>
  </FormControl>;
};

export default withData(InstanceFilterSelector);