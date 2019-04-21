import React, {Component} from "react";
import {withData} from "../DataProvider";
import "./InstanceTableRow.css";

class InstanceDistributionChart extends Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.instance !== nextProps.instance ||
      this.props.epochs.length !== nextProps.epochs.length;
  }

  render() {
    const {instance, epochs} = this.props;
    const {getLabel, getColor} = this.props.data;

    const distributionPairs = epochs.reduce((acc, curr) => {
      const predicted = curr.classifications[instance.index].predicted;
      const lastIndex = acc.length - 1;
      const lastElement = acc[lastIndex];

      if (lastElement !== undefined && predicted === lastElement[0]) {
        lastElement[1]++;
      } else {
        acc.push([predicted, 1]);
      }
      return acc;
    }, []);
    return <div className="bar-chart-container" style={{
      display: "flex"
    }}>
      {distributionPairs.map((pair, i) =>
        <div key={i}
             data-tip={`${pair[1]} ${getLabel(pair[0])}(s)`}
             className="bar-chart"
             style={{
               flex: pair[1],
               height: "20px",
               //"--box-color": getIncludedOrOtherColor(pair[0])
               "--box-color": getColor(pair[0])
             }}/>
      )}</div>;
  }
}

export default withData(InstanceDistributionChart);