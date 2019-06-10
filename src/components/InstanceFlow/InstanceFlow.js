import React, {useContext} from "react";
import {withData} from "../DataProvider";
import "./InstanceFlow.css"
import InstanceEpochContainer from "./InstanceEpochContainer";
import InstanceFlowSVG from "./SVG/FlowSVG";
import {FlowDataContext} from "./FlowDataProvider";

function InstanceFlow(props) {
  const flowData = useContext(FlowDataContext);

  const {getClassesWithOther, getLabel} = props.data;
  const {epochs, instances: allInstances} = props;
  const {classView} = flowData;

  const instances = allInstances.filter(instance => instance.displayInFlow);

  const classesWithOther = getClassesWithOther();
  return <div className="overflow-container">
    <div className={"instance-flow-container" + (classView === "dense" ? " dense" : "")} style={{
      gridTemplateColumns: `0px repeat(${epochs.length}, 1fr)`,
      gridTemplateRows: `repeat(${classesWithOther.length}, 1fr)`
    }}>
      {classesWithOther.map((clazz, i) =>
        <span key={clazz} style={{
          order: i
        }} className="class-label">{getLabel(clazz)}</span>
      )}
      <span style={{order: classesWithOther.length}}/>
      {epochs.map(epoch =>
        <InstanceEpochContainer key={epoch.id} instances={instances} classes={classesWithOther} epoch={epoch}/>
      )}
      <InstanceFlowSVG instances={instances} epochs={epochs}/>
    </div>
  </div>;
}

export default withData(InstanceFlow);