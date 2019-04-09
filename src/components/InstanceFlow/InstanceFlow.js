import React, {Component} from "react";
import {withData} from "../DataProvider";
import "./InstanceFlow.css"
import InstanceEpochContainer from "./InstanceEpochContainer";
import InstanceFlowSVG from "./SVG/FlowSVG";
import {withFlowData} from "./FlowDataProvider";

class InstanceFlow extends Component {
  render() {
    const {getClassesWithOther} = this.props.data;
    const {epochs, instances : allInstances} = this.props;

    const instances = allInstances.filter(instance => instance.displayInFlow);

    const classesWithOther = getClassesWithOther();
    return <div className="overflow-container">
      <div className="instance-flow-container" style={{
        gridTemplateColumns: `repeat(${epochs.length}, 1fr)`,
        gridTemplateRows: `repeat(${classesWithOther.length}, 1fr)`
      }}>
        {epochs.map(epoch =>
          <InstanceEpochContainer key={epoch.id} instances={instances} classes={classesWithOther} epoch={epoch}/>
        )}
        <InstanceFlowSVG instances={instances} epochs={epochs} />
      </div>
    </div>;
  }
}

export default withData(withFlowData(InstanceFlow));