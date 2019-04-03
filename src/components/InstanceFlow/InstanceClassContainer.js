import React, {Component} from "react";
import {withData} from "../DataProvider";
import "./InstanceClassContainer.css"
import InstanceClassBarChart from "./InstanceClassBarChart";
import {withFlowData} from "./FlowDataProvider";
import InstanceClassInstances from "./InstanceClassBars";

class InstanceClassContainer extends Component {
  set = false;

  render() {
    const {instances, clazz, order, epoch} = this.props;
    const {classes: classesWithoutOther} = this.props.data;
    const {classView, updateContainerElements} = this.props.flowData;
    if (!epoch.stats[clazz]) return null;
    const {getColor} = this.props.data;
    return <div className="instance-class-container"
                style={{borderColor: getColor(clazz), order: order}}
                ref={e => {
                  if(e && !this.set) {
                    this.set = true;
                    updateContainerElements(clazz, epoch.id, e);
                  }
                }}>
      {classView === "overview" && <InstanceClassBarChart stats={epoch.stats[clazz]} classes={classesWithoutOther}/>}
      {classView === "instances" && <InstanceClassInstances instances={instances} epoch={epoch} clazz={clazz} />}
    </div>;
  }
}

export default withData(withFlowData(InstanceClassContainer));