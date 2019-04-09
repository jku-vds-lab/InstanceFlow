import React, {Component} from "react";
import "./SVGBasicSankey.css";

class SVGBasicSankey extends Component {
  state = {
    clicked: false
  };

  getInstancesFromSankey(sourceClass, targetClass, fromClass, epoch, nextEpoch) {
    return this.props.data.instances
      .filter(instance => instance.actual === fromClass)
      .filter(instance => instance.displayInFlow)
      .filter(instance => this.props.data.getIncludedOrOtherIndex(epoch.classifications[instance.index].predicted) === sourceClass)
      .filter(instance => this.props.data.getIncludedOrOtherIndex(nextEpoch.classifications[instance.index].predicted) === targetClass);
  }

  render() {
    //console.log("SVGBasicSankey");
    const {startHeight, endHeight, color, sourceClass, targetClass, fromClass, epoch, nextEpoch, text, svgBounds} = this.props;
    const {activateInstances, deactivateInstances} = this.props.data;
    const {clicked} = this.state;
    const startX = -svgBounds.x + this.props.startX;
    const startY = -svgBounds.y + this.props.startY;
    const endX = -svgBounds.x + this.props.endX;
    const endY = -svgBounds.y + this.props.endY;
    const halfDistanceX = Math.abs((endX - startX) / 2);

    const instances = this.getInstancesFromSankey(sourceClass, targetClass, fromClass, epoch, nextEpoch);

    return <path
      data-tip={text}
      data-effect="float"
      className={"sankey-bar " + (clicked ? "active" : "")}
      xmlns="http://www.w3.org/2000/svg"
      d={"M" + startX + " " + startY +
      " C" + (startX + halfDistanceX) + " " + startY + ", " + (endX - halfDistanceX) + " " + endY + ", " + endX + " " + endY +
      " L" + endX + " " + (endY + endHeight) +
      " C" + (endX - halfDistanceX) + " " + (endY + endHeight) + ", " + (startX + halfDistanceX) + " " + (startY + startHeight) + ", " + startX + " " + (startY + startHeight) +
      " L" + startX + " " + startY}
      fill={color}
      stroke="none"
      onMouseOver={e => {
        activateInstances(undefined, ...instances)
      }}
      onMouseOut={e => {
        deactivateInstances(false, ...instances);
      }}
      onClick={e => {
        if (!clicked) {
          this.setState({clicked: true});
          activateInstances({clicked: true, lines: true}, ...instances);
        } else {
          this.setState({clicked: false});
          deactivateInstances(true, ...instances);
        }
      }}
    />
  }
}

export default SVGBasicSankey;