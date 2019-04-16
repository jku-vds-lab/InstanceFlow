import React, {PureComponent} from "react";
import {withData} from "../DataProvider";
import InstanceBox from "../Basic/InstanceBox";
import "./InstanceClassBars.css";

class InstanceClassBars extends PureComponent {
  render() {
    const {instances, epoch, clazz} = this.props;
    return <div className="instance-class-bars">
      {["in", "stable", "inout", "out"].map(type =>
        <div key={type} className="instance-class-bar"
             style={{gridTemplateColumns: `repeat(${Math.ceil(epoch.stats[clazz][type].total / 20)}, 1fr)`}}>
          {instances.filter(instance => epoch.classifications[instance.index].type === type).map(instance => {
              const classification = epoch.classifications[instance.index];
              return <InstanceBox key={instance.id}
                                  epoch={epoch}
                                  instance={instance}
                                  classification={classification}/>;
            }
          )}
        </div>
      )}
    </div>;
  }
}

export default withData(InstanceClassBars);