import React, {Component, useContext, useEffect, useRef} from "react";
import {withData} from "../DataProvider";
import "./InstanceClassContainer.css"
import InstanceClassBarChart from "./InstanceClassBarChart";
import {FlowDataContext} from "./FlowDataProvider";
import InstanceClassInstances from "./InstanceClassBars";

function InstanceClassContainer(props) {
  const ref = useRef(null);
  const flowData = useContext(FlowDataContext);

  const {instances, clazz, order, epoch} = props;
  const {classes: classesWithoutOther} = props.data;
  const {classView, updateContainerElements} = flowData;

  useEffect(() => {
    updateContainerElements(clazz, epoch.id, ref.current);
  }, [ref.current]);

  if (!epoch.stats[clazz]) return null;
  const {getColor} = props.data;
  return <div className="instance-class-container"
              style={{borderColor: getColor(clazz), order: order}}
              ref={ref}>
    {classView === "overview" && <InstanceClassBarChart stats={epoch.stats[clazz]} classes={classesWithoutOther}/>}
    {classView === "instances" && <InstanceClassInstances instances={instances} epoch={epoch} clazz={clazz}/>}
  </div>;
}

export default withData(InstanceClassContainer);