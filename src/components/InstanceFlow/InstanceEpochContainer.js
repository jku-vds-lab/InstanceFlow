import React, {Component} from "react";
import {withData} from "../DataProvider";
import "./InstanceEpochContainer.css"
import InstanceClassContainer from "./InstanceClassContainer";

class InstanceEpochContainer extends Component {
  render() {
    const {instances, classes, epoch} = this.props;
    const {getIncludedOrOtherIndex} = this.props.data;
    return [classes.map((clazz, clazzIndex) =>
      <InstanceClassContainer key={`${clazz}`}
                              instances={
                                instances
                                  .filter(instance => getIncludedOrOtherIndex(epoch.classifications[instance.index].predicted) === clazz)}
                              clazz={clazz}
                              epoch={epoch}
                              order={clazzIndex}
                              classes={classes}/>),
      <div key="label" className="label"
           style={{order: (classes.length)}}>#{epoch.id}</div>
    ]
  }
}

export default withData(InstanceEpochContainer);