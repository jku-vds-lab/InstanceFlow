import React, {Component} from "react";
import InstanceItem from "./InstanceItem";
import "./InstanceList.css"
import {withFlowData} from "../InstanceFlow/FlowDataProvider";

class InstanceList extends Component {
  render() {
    const {instances, epochs} = this.props;
    const {sortMetric} = this.props.flowData;
    return <div className="instance-list">
      <div className="instance-detail-row">
        <b>ID</b>
        <b>Image</b>
        <b>Actual</b>
        <b style={{flex: 2}}>Distribution</b>
        <b>Variance</b>
        <b>Variability</b>
        <b>Score</b>
      </div>
      {instances.filter(instance => instance.displayInList).concat().sort((i1, i2) => i2.clicked - i1.clicked || i2[sortMetric] - i1[sortMetric] || 0).map(instance =>
        <InstanceItem key={instance.id} instance={instance} epochs={epochs}/>
      )}
    </div>;
  }
}

export default withFlowData(InstanceList);