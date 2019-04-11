import React from "react";
import {withData} from "../DataProvider";

const DataUploadInput = (props) => {
  const {initializeData} = props.data;
  return <input type="file" id="files" name="files[]" accept=".json,application/json" onChange={e => {
    if (e.target.files[0]) {
      const fr = new FileReader();
      fr.onload = e => {
        const res = JSON.parse(e.target.result);
        // TODO: Some JSON checking
        initializeData(res);
      };
      fr.readAsText(e.target.files[0]);
    }
  }}/>;

};

export default withData(DataUploadInput);