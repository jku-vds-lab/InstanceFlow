import React, {useState} from "react";

const EpochSelector = (props) => {
  const {to, setTo, from, setFrom} = props;
  return <div>
    <input type="number" value={from} onChange={e => setFrom(parseInt(e.target.value))}/>
    <input type="number" value={to} onChange={e => setTo(parseInt(e.target.value))}/>
  </div>;

};

export default EpochSelector;