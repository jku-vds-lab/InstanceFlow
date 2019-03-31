import React, {Component} from "react";
import SimpleBox from "./SimpleBox";
import {withData} from "../DataProvider";

class InstanceBox extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.instance !== nextProps.instance ||
      this.props.classification !== nextProps.classification;
  }

  refCallback = element => {
    if (element) {
      this.props.data.updateBoxElements(this.props.instance.id, this.props.epoch.id, element);
    }
  };

  componentWillUnmount() {
    this.props.data.updateBoxElements(this.props.instance.id, this.props.epoch.id, null);
  }

  render() {
    //console.log("InstanceBox");
    const {instance, classification, style} = this.props;
    const {getColor, getLabel, activateInstances, deactivateInstances} = this.props.data;

    if (!instance) return null;
    return <SimpleBox type={classification.type}
                      color={instance.active ? "gold" : getColor(instance.actual)}
                      opacity={instance.active ? 1.0 : instance.score}
                      tooltipText={`${getLabel(instance.actual)} as ${getLabel(classification.predicted)}`}
                      style={style}
                      id={instance.id}
                      refCallback={this.refCallback}
                      onMouseOver={e => {
                        if (!instance.clicked)
                          activateInstances({lines: true}, instance.id)
                      }}
                      onMouseOut={e => {
                        if (!instance.clicked)
                          deactivateInstances(false, instance.id);
                      }}
                      onClick={e => {
                        if (!instance.clicked) {
                          activateInstances({clicked: true, lines: true}, instance.id);
                        } else {
                          activateInstances({clicked: false, lines: false}, instance.id);
                        }
                      }}
    />;
  }
}

export default withData(InstanceBox);