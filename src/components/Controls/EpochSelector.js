import React from "react";
import Slider, {Range} from "rc-slider";
import {withData} from "../DataProvider";
import 'rc-slider/assets/index.css';

const RangeWithTooltip = Slider.createSliderWithTooltip(Range);
const EpochSelector = (props) => {
  const {to, setTo, from, setFrom, raw_data} = props.data;
  return <div>
    {/*<input type="number" value={from} onChange={e => setFrom(parseInt(e.target.value))}/><br/>
    <input type="number" value={to} onChange={e => setTo(parseInt(e.target.value))}/>*/}
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
  </div>;

};

export default withData(EpochSelector);