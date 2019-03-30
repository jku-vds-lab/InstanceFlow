import React from "react";
import InstanceList from "./InstanceList/InstanceList";
import EpochSelector from "./EpochSelector";
import {withData} from "./DataProvider";
import "./MainPage.css";

const MainPage = (props) => {
  const {from, setFrom, to, setTo, data, epochs} = props.data;

  return <div>
      <div>
        <EpochSelector from={from} to={to} setFrom={setFrom} setTo={setTo}/>
        {data && <InstanceList instances={data.instances} epochs={epochs}/>}
      </div>
  </div>;
};

export default withData(MainPage);