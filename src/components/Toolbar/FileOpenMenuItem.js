import React from "react";
import {withData} from "../DataProvider";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";

const FileOpenMenuItem = (props) => {
  let fileInputRef;
  const {initializeData} = props.data;
  const {onDataLoaded} = props;
  return <MenuItem onClick={e => {
    fileInputRef && fileInputRef.click();
  }}>
    Open File...
    <input ref={ref => fileInputRef = ref} type="file" style={{display: "none"}} id="files" name="files[]"
           accept=".json,application/json"
           onAbort={e => console.log(e)}
           onChange={e => {
             if (e.target.files[0]) {
               const fr = new FileReader();
               fr.onload = e => {
                 const res = JSON.parse(e.target.result);
                 // TODO: Some JSON checking
                 initializeData(res);
                 onDataLoaded && onDataLoaded();
               };
               fr.readAsText(e.target.files[0]);
             }
           }}/></MenuItem>;

};

export default withData(FileOpenMenuItem);