import React, {PureComponent} from "react";
import {withData} from "../DataProvider";
import "./InstanceClassBarChart.css"

class InstanceClassBarChart extends PureComponent {
  render() {
    const {stats, classes} = this.props;
    const {getLabel, getColor, maxInstancesPerClass} = this.props.data;
    return <div className="bar-charts-container">
      {classes.map(clazz =>
        <div className="bar-chart-container">
          {["in", "stable", "inout", "out"].map(type => {
            //if(!stats[type] || !stats[type][clazz]) return null;
            return <div className={`bar-chart tooltip-container ${type}`}
                        style={{
                          "--box-color": getColor(clazz),
                          width: `${stats[type][clazz] / maxInstancesPerClass * 100}%`
                        }}>
              <div className="tooltip-text">{stats[type][clazz]} {getLabel(clazz)}(s) {type}</div>
            </div>;
          })}
        </div>
      )}
    </div>;
  }
}

export default withData(InstanceClassBarChart);