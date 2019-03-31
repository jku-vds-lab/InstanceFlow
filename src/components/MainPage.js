import React, {Component} from "react";
import InstanceList from "./InstanceList/InstanceList";
import EpochSelector from "./Controls/EpochSelector";
import {withData} from "./DataProvider";
import "./MainPage.css";
import ClassSelector from "./Controls/ClassSelector";
import Legend from "./Controls/Legend";
import InstanceFlow from "./InstanceFlow/InstanceFlow";

class MainPage extends Component {
  render() {
    //console.log("MainPage");
    const {from, setFrom, to, setTo, epochs, instances, loading, labelsWithOther, colors} = this.props.data;
    return <div>
      <div style={{display: "flex"}}>
        <EpochSelector from={from} to={to} setFrom={setFrom} setTo={setTo}/>
        <ClassSelector/>
        <Legend labels={labelsWithOther} colors={colors} />
      </div>
      {!loading && <InstanceFlow instances={instances} epochs={epochs}/>}
      {!loading && <InstanceList instances={instances} epochs={epochs}/>}
    </div>;
  }
}

export default withData(MainPage);