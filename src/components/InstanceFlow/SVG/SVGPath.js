import React, {PureComponent} from "react";

class SVGPath extends PureComponent {
  render() {
    const {source, target, svgBounds, color} = this.props;
    if (!source || !target) return null;
    const sourceBounds = source.getBoundingClientRect();
    const targetBounds = target.getBoundingClientRect();
    const startX = (-svgBounds.x + sourceBounds.right);
    const startY = (-svgBounds.y + sourceBounds.top + sourceBounds.height / 2);
    const endX = (-svgBounds.x + targetBounds.left);
    const endY = (-svgBounds.y + targetBounds.top + targetBounds.height / 2);
    const halfDistanceX = Math.abs((endX - startX) / 2);
    return <path
      xmlns="http://www.w3.org/2000/svg"
      d={"M" + startX + " " + startY + " C" + (startX + halfDistanceX) + " " + startY + ", " + (endX - halfDistanceX) + " " + endY + ", " + endX + " " + endY}
      stroke={color}
      fill="none"
    />
  }
}

export default SVGPath;