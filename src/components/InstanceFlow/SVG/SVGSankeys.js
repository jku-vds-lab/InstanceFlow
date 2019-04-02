import React, {Component} from "react";
import {withData} from "../../DataProvider";
import SVGBasicSankey from "./SVGBasicSankey";
import ReactTooltip from "react-tooltip";

class SVGSankeys extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.epochs !== nextProps.epochs ||
      this.props.svgBounds.width !== nextProps.svgBounds.width ||
      this.props.svgBounds.height !== nextProps.svgBounds.height ||
      this.props.containerElements !== nextProps.containerElements;
  }

  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  render() {
    //console.log("SVGSankeys");
    const {epochs, svgBounds, containerElements} = this.props;
    if (!svgBounds) return null;
    const {maxInstancesPerClass, getClassesWithOther, classes, getColor, getLabel} = this.props.data;

    const classesWithOther = getClassesWithOther();
    return epochs.slice(0, -1).map((epoch, epochIndex) => {
      const targetOffset = [];
      return classesWithOther.map(sourceClass => {
        if (!containerElements.has(sourceClass)) return null;
        if (!containerElements.get(sourceClass).has(epoch.id)) return null;
        const sourceBounds = containerElements.get(sourceClass).get(epoch.id).getBoundingClientRect();
        let sourceOffset = 0;
        return classesWithOther.map(targetClass => {
          const nextEpoch = epochs[epochIndex + 1];
          if (!containerElements.has(targetClass)) return null;
          if (!containerElements.get(targetClass).has(nextEpoch.id)) return null;
          const targetBounds = containerElements.get(targetClass).get(nextEpoch.id).getBoundingClientRect();

          if (!targetOffset[targetClass])
            targetOffset[targetClass] = 0;

          // Key: From which class, Value: How many?
          if(!epoch.stats[sourceClass]) return null;
          const toArr = epoch.stats[sourceClass].to[targetClass];
          if (!toArr) return null;
          return classes.map(fromClass => {
            const amount = toArr[fromClass];
            if (!classes.includes(fromClass)) return null;
            if (!amount) return null;
            const sourceHeightPercentage = amount / maxInstancesPerClass;
            const sourceHeight = sourceHeightPercentage * sourceBounds.height;

            //const targetHeightPercentage = howMany / nextEpoch.stats[targetCIndex].total;
            const targetHeightPercentage = amount / maxInstancesPerClass;
            const targetHeight = targetHeightPercentage * targetBounds.height;

            const res = <SVGBasicSankey
              data={this.props.data}
              key={fromClass + "-" + sourceClass + "-to-" + targetClass + "-" + epoch.id}
              svgBounds={svgBounds}
              startX={sourceBounds.right}
              startY={sourceBounds.top + sourceOffset}
              startHeight={sourceHeight}
              endX={targetBounds.left}
              endY={targetBounds.top + targetOffset[targetClass]}
              endHeight={targetHeight}
              color={getColor(fromClass)}
              sourceClass={sourceClass}
              targetClass={targetClass}
              fromClass={fromClass}
              epoch={epoch}
              nextEpoch={nextEpoch}
              text={`${amount} ${getLabel(fromClass)}(s) from ${getLabel(sourceClass)} to ${getLabel(targetClass)}`} />;

            sourceOffset += sourceHeight;
            targetOffset[targetClass] += targetHeight;

            return res;
          });
        });
      });
    });
  }
}

export default withData(SVGSankeys);