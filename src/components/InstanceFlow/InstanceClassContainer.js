import React, {Component} from "react";
import {withData} from "../DataProvider";
import InstanceBox from "../Basic/InstanceBox";
import "./InstanceClassContainer.css"
import InstanceClassBarChart from "./InstanceClassBarChart";

class InstanceClassContainer extends Component {
  set = false;

  render() {
    const {instances, clazz, order, epoch, classes} = this.props;
    const {updateContainerElements} = this.props.data;
    const mode = "instances";
    if (!epoch.stats[clazz]) return null;
    const {getColor} = this.props.data;
    return <div className="instance-class-container"
                style={{borderBottomColor: getColor(clazz), order: order}}
                ref={e => {
                  if(e && !this.set) {
                    this.set = true;
                    updateContainerElements(clazz, epoch.id, e);
                  }
                }}>
      {mode === "overview" && <InstanceClassBarChart stats={epoch.stats[clazz]} classes={classes}/>}
      {mode === "instances" && ["in", "stable", "inout", "out"].map(type =>
        <div key={type} className="instance-class-bar"
             style={{gridTemplateColumns: `repeat(${Math.ceil(epoch.stats[clazz][type].total / 10)}, 1fr)`}}>
          {instances.filter(instance => epoch.classifications[instance.index].type === type).map(instance => {
              const classification = epoch.classifications[instance.index];
              return <InstanceBox key={instance.id}
                                  epoch={epoch}
                                  instance={instance}
                                  classification={classification}
                                  style={{order: 100 - Math.abs(instance.actual - clazz)}}/>;
            }
          )}
        </div>
      )}
    </div>;
  }
}

export default withData(InstanceClassContainer);