import React, {Component, PureComponent} from "react";
import {withData} from "../DataProvider";
import "./InstanceClassBarChart.css"

class InstanceClassBarChart extends Component {
  render() {
    const {stats, classes} = this.props;
    const {getLabel, getColor, maxInstancesPerPredictionPerClass} = this.props.data;
    return <div className="bar-charts-container">
      {classes.map(clazz =>
        <div key={clazz} className="bar-chart-container">
          {["in", "stable", "inout", "out"].map(type => {
            if(!stats[type] || !stats[type][clazz]) return null;
            return <div
              key={clazz + " " + type}
              data-tip={`${stats[type][clazz]} ${getLabel(clazz)}(s) ${type}`}
              className={`bar-chart tooltip-container ${type}`}
              style={{
                "--box-color": getColor(clazz),
                width: `${stats[type][clazz] / maxInstancesPerPredictionPerClass * 100}%`
              }}/>;
          })}
        </div>
      )}
    </div>;
  }
}

export default withData(InstanceClassBarChart);