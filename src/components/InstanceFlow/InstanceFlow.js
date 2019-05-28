import React, {Component} from "react";
import {withData} from "../DataProvider";
import "./InstanceFlow.css"
import InstanceEpochContainer from "./InstanceEpochContainer";
import InstanceFlowSVG from "./SVG/FlowSVG";
import {withFlowData} from "./FlowDataProvider";

class InstanceFlow extends Component {
  render() {
    const {getClassesWithOther, getLabel} = this.props.data;
    const {epochs, instances: allInstances} = this.props;
    const {classView} = this.props.flowData;

    const instances = allInstances.filter(instance => instance.displayInFlow);

    const classesWithOther = getClassesWithOther();
    return <div className="overflow-container">
      <div className={"instance-flow-container" + (classView === "dense" ? " dense" : "")} style={{
        gridTemplateColumns: `0px repeat(${epochs.length}, 1fr)`,
        gridTemplateRows: `repeat(${classesWithOther.length}, 1fr)`
      }}>
        {classesWithOther.map((clazz, i) =>
          <span style={{
            order: i
          }} className="class-label">{getLabel(clazz)}</span>
        )}
        <span style={{order: classesWithOther.length}} />
        {epochs.map(epoch =>
          <InstanceEpochContainer key={epoch.id} instances={instances} classes={classesWithOther} epoch={epoch}/>
        )}
        <InstanceFlowSVG instances={instances} epochs={epochs}/>
      </div>
    </div>;
  }
}

export default withData(withFlowData(InstanceFlow));