import React from "react";
import EpochSelector from "./EpochSelector";
import SortSelector from "./SortSelector";
import OpacitySelector from "./OpacitySelector";
import ClassSelector from "./ClassSelector";
import ClassViewSelector from "./ClassViewSelector";
import InstanceFilterSelector from "./InstanceFilterSelector";
import SankeyEnableCheckbox from "./SankeyEnableCheckbox";
import "./AllControls.css";

const AllControls = (props) => {
  const {
    showEpochSelector,
    showSortingSelector,
    showOpacitySelector,
    showClassSelector,
    showClassViewSelector,
    showInstanceFilterSelector,
    showSankeyEnableCheckbox
  } = props;
  return <div className="controls-grid">
    {showEpochSelector && <span>Epochs:</span>}
    {showEpochSelector && <EpochSelector stlye={{gridRowStart: 1, gridRowEnd: 2}}/>}
    {showSortingSelector && <span>Sorting:</span>}
    {showSortingSelector && <SortSelector/>}
    {showOpacitySelector && <span>Opacity:</span>}
    {showOpacitySelector && <OpacitySelector/>}
    {showClassSelector && <span>Classes:</span>}
    {showClassSelector && <ClassSelector/>}
    {showClassViewSelector && <span>Class View:</span>}
    {showClassViewSelector && <ClassViewSelector/>}
    {showInstanceFilterSelector && <span>Instance Filter:</span>}
    {showInstanceFilterSelector && <InstanceFilterSelector/>}
    {showSankeyEnableCheckbox && <span/>}
    {showSankeyEnableCheckbox && <SankeyEnableCheckbox/>}
  </div>;

};

export default AllControls;