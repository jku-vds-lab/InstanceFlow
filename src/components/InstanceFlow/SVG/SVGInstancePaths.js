import React, {PureComponent} from "react";
import SVGPath from "./SVGPath";

class SVGInstancePaths extends PureComponent {
  render() {
    const {instance, epochs, svgBounds, boxElements} = this.props;
    let previous = null;
    let previousClassification = null;
    if (!boxElements.has(instance.id)) return null;
    return epochs.map(epoch => {
      if (!boxElements.get(instance.id).has(epoch.id)) return null;
      const current = boxElements.get(instance.id).get(epoch.id);
      const classification = epoch.classifications[instance.index];
      if (previous === null && previousClassification === null) {
        previous = current;
        previousClassification = epoch.classifications[instance.index];
        return null;
      }
      const res = <SVGPath
        key={epoch.id}
        source={previous}
        target={current}
        svgBounds={svgBounds}
        color={(!previous.isCorrect && classification.isCorrect) ? "green" : "red"}
        fill="none"
      />;
      previous = current;
      return res;
    })
  }
}

export default SVGInstancePaths;