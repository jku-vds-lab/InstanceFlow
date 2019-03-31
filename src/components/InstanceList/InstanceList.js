import React from "react";
import InstanceItem from "./InstanceItem";
import "./InstanceList.css"

const InstanceList = (props) => {
  const {instances, epochs} = props;

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
    {instances.filter(instance => instance.display).map(instance =>
      <InstanceItem key={instance.id} instance={instance} epochs={epochs} />
    )}
  </div>;
};

export default InstanceList;