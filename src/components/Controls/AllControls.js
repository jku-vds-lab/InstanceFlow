import React from "react";
import EpochSelector from "./EpochSelector";
import SortSelector from "./SortSelector";
import OpacitySelector from "./OpacitySelector";
import ClassSelector from "./ClassSelector";
import ClassViewSelector from "./ClassViewSelector";
import InstanceFilterSelector from "./InstanceFilterSelector";
import SankeyEnableCheckbox from "./SankeyEnableCheckbox";
import "./AllControls.css";
import Grid from "@material-ui/core/Grid/Grid";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import FormControl from "@material-ui/core/FormControl/FormControl";

const AllControls = (props) => {
  const {
    showEpochSelector,
    showSortingSelector,
    showOpacitySelector,
    showClassSelector,
    showClassViewSelector,
    showInstanceFilterSelector,
    showSankeyEnableCheckbox,
    style
  } = props;
  return <div style={style} className="all-controls">
    <FormControl fullWidth component="fieldset">
      <FormLabel component="legend">Configuration</FormLabel>
      <Grid container spacing={16} alignItems="center">
        {showSortingSelector && <Grid xs={12} sm={6} md={3} lg={2} item><SortSelector/></Grid>}
        {showOpacitySelector && <Grid xs={12} sm={6} md={3} lg={2} item><OpacitySelector/></Grid>}
        {showClassViewSelector && <Grid xs={12} sm={6} md={3} lg={2} item><ClassViewSelector/></Grid>}
        {showInstanceFilterSelector && <Grid xs={12} sm={6} md={3} lg={2} item><InstanceFilterSelector/></Grid>}
        {showSankeyEnableCheckbox && <Grid xs={12} sm={6} md={3} lg={4} item><SankeyEnableCheckbox/></Grid>}
      </Grid>
    </FormControl>
    {showClassSelector && <ClassSelector className="input-element"/>}
    {showEpochSelector && <EpochSelector/>}
  </div>;
};

AllControls.defaultProps = {
  showEpochSelector: true,
  showClassSelector: true,
  showDataUploadInput: true,
  showSortingSelector: false,
  showOpacitySelector: false,
  showClassViewSelector: false,
  showInstanceFilterSelector: false,
  showSankeyEnableCheckbox: false,
};

export default AllControls;