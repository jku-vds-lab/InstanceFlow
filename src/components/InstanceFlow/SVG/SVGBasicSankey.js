import React, {PureComponent} from "react";
import "./SVGBasicSankey.css"

class SVGBasicSankey extends PureComponent {
  state = {
    clicked: false
  };

  getInstanceIdsFromSankey(sourceClass, targetClass, fromClass, epoch, nextEpoch) {
    return this.props.data.instances
      .filter(instance => instance.actual === fromClass)
      .filter(instance => this.props.data.getIncludedOrOtherIndex(epoch.classifications[instance.index].predicted) === sourceClass)
      .filter(instance => this.props.data.getIncludedOrOtherIndex(nextEpoch.classifications[instance.index].predicted) === targetClass)
      .map(instance => instance.id);
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

    const instanceIds = this.getInstanceIdsFromSankey(sourceClass, targetClass, fromClass, epoch, nextEpoch);

    return <path
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
          activateInstances(undefined, ...instanceIds)
      }}
      onMouseOut={e => {
          deactivateInstances(false, ...instanceIds);
      }}
      onClick={e => {
        if (!clicked) {
          this.setState({clicked: true});
          activateInstances({clicked: true, lines: true}, ...instanceIds);
        } else {
          this.setState({clicked: false});
          activateInstances({clicked: false, lines: false}, ...instanceIds);
        }
      }}
    ><title xmlns="http://www.w3.org/2000/svg">{text}</title></path>
  }
}

export default SVGBasicSankey;