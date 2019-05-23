import React from "react";
import Slider, {Range} from "rc-slider";
import {withData} from "../DataProvider";
import 'rc-slider/assets/index.css';
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";

const RangeWithTooltip = Slider.createSliderWithTooltip(Range);
const EpochSelector = (props) => {
  const {to, setTo, from, setFrom, raw_data} = props.data;
  if(!raw_data) return null;
  return <FormControl fullWidth component="fieldset">
    <FormLabel component="legend">Epoch Selector</FormLabel>
    <RangeWithTooltip min={0}
                      max={raw_data.epochs.length - 1}
                      defaultValue={[from, to]}
                      tipFormatter={value => `${(raw_data.epochs[value] || {}).id || "?"}. Epoch`}
                      onAfterChange={value => {
                        value = value.sort();
                        setFrom(value[0]);
                        setTo(value[1]);
                      }}
                      trackStyle={{
                        backgroundColor: 'lightgray',
                      }}
                      handleStyle={{
                        borderColor: 'gray',
                        backgroundColor: 'lightgray',
                      }}
    />
    <FormHelperText>Displaying {from}. to {to}. Epoch</FormHelperText>
  </FormControl>;

};

export default withData(EpochSelector);