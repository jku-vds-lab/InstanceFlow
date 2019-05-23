import React, {useState} from "react";
import FormControl from "@material-ui/core/FormControl/FormControl";
import Select from "@material-ui/core/Select/Select";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Input from "@material-ui/core/Input/Input";
import {withData} from "../DataProvider";

const DatasetSelector = (props) => {
  const {initializeData} = props.data;

  const metrics = ["none", "cifar10.json", "mnist.json"];
  const metricLabels = ["None", "CIFAR10", "MNIST"];

  const [selectedDataset, setSelectedDataset] = useState(metrics[0]);

  return <FormControl margin="dense" fullWidth>
    <InputLabel shrink htmlFor="dataset-selector">
      Sample Datasets
    </InputLabel>
    <Select
      value={selectedDataset}
      onChange={e => {
        const datasetName = e.target.value;
        if (datasetName === "none") {
          initializeData(null);
        } else {
          fetch(`datasets/${datasetName}`)
            .then(response => {
              if (!response.ok) {
                throw new Error("HTTP error " + response.status);
              }
              return response.json();
            })
            .then(json => {
              initializeData(json);
            })
            .catch(error => {
              console.log(error);
            })
        }
        setSelectedDataset(datasetName);
      }}
      input={<Input name="dataset" id="dataset-selector"/>}
      name="datasetSelector"
    >
      {metrics.map((value, valueIndex) =>
        <MenuItem key={valueIndex} value={value}>{metricLabels[valueIndex]}</MenuItem>
      )}
    </Select>
    {/*<FormHelperText></FormHelperText>*/}
  </FormControl>;
};

export default withData(DatasetSelector);