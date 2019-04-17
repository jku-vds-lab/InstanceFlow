import React from "react";
import {withData} from "../DataProvider";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";


const downloadObjectAsJson = (exportObj, exportName) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const ExportInstancesMenuItem = (props) => {
  const {onClick} = props;
  const {clickedInstances} = props.data;

  return <MenuItem disabled={clickedInstances.size === 0}
                   onClick={() => {
                     downloadObjectAsJson(Array.from(clickedInstances), "instances");
                     onClick();
                   }}
  >
    Export Active Instances...
  </MenuItem>;
};

export default withData(ExportInstancesMenuItem);