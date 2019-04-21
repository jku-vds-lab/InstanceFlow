import React, {Component} from "react";
import SimpleBox from "./SimpleBox";
import {withData} from "../DataProvider";
import {withFlowData} from "../InstanceFlow/FlowDataProvider";

class InstanceBox extends Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.instance !== nextProps.instance ||
      this.props.data.activeInstances.has(this.props.instance.id) !== nextProps.data.activeInstances.has(nextProps.instance.id) ||
      this.props.data.clickedInstances.has(this.props.instance.id) !== nextProps.data.clickedInstances.has(nextProps.instance.id) ||
      this.props.classification !== nextProps.classification ||
      this.props.flowData.opacityMetric !== nextProps.flowData.opacityMetric ||
      this.props.flowData.sortMetric !== nextProps.flowData.sortMetric;
  }

  refCallback = element => {
    if (element) {
      this.props.flowData.updateBoxElements(this.props.instance.id, this.props.epoch.id, element);
    }
  };

  componentWillUnmount() {
    this.props.flowData.updateBoxElements(this.props.instance.id, this.props.epoch.id, null);
  }

  render() {
    const {instance, classification, style} = this.props;
    const {getColor, getLabel, activeInstances, clickedInstances, activateInstances, deactivateInstances} = this.props.data;
    const {opacityMetric} = this.props.flowData;

    const active = activeInstances.has(instance.id);
    const clicked = clickedInstances.has(instance.id);

    if (!instance) return null;
    return <SimpleBox type={classification.type}
                      color={active ? "gold" : getColor(instance.actual)}
                      opacity={active ? 1.0 : (instance[opacityMetric] === undefined ? 1.0 : Math.max(instance[opacityMetric], 0.1))}
                      tooltipText={`${getLabel(instance.actual)} as ${getLabel(classification.predicted)}`}
                      style={style}
                      id={instance.id}
                      refCallback={this.refCallback}
                      onMouseOver={e => {
                        if (!clicked)
                          activateInstances({lines: true}, instance)
                      }}
                      onMouseOut={e => {
                        if (!clicked)
                          deactivateInstances(false, instance);
                      }}
                      onClick={e => {
                        if (!clicked) {
                          activateInstances({clicked: true, lines: true}, instance);
                        } else {
                          activateInstances({clicked: false, lines: false}, instance);
                        }
                      }}
    />;
  }
}

export default withData(withFlowData(InstanceBox));