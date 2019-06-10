import React, {useContext, useEffect, useRef} from "react";
import SimpleBox from "./SimpleBox";
import {withData} from "../DataProvider";
import {FlowDataContext} from "../InstanceFlow/FlowDataProvider";

function InstanceBox(props) {
  const ref = useRef(null);
  const flowData = useContext(FlowDataContext);

  const {instance, classification, style} = props;
  const {getColor, getLabel, deactivateInstances, activateInstances} = props.data;
  const {opacityMetric} = flowData;

  useEffect(() => {
    flowData.updateBoxElements(props.instance.id, props.epoch.id, ref.current);
    return () => {
      flowData.updateBoxElements(props.instance.id, props.epoch.id, null);
    }
  }, [ref.current]);

  const {active, clicked} = instance;

  if (!instance) return null;
  return <SimpleBox type={classification.type}
                    color={active ? "gold" : getColor(instance.actual)}
                    opacity={active ? 1.0 : (instance[opacityMetric] === undefined ? 1.0 : Math.max(instance[opacityMetric], 0.1))}
                    tooltipText={`${getLabel(instance.actual)} as ${getLabel(classification.predicted)}`}
                    style={style}
                    id={instance.id}
                    refCallback={ref}
                    onMouseOver={e => {
                      if (!clicked)
                        activateInstances({active: true, lines: true}, instance)
                    }}
                    onMouseOut={e => {
                      if (!clicked)
                        deactivateInstances(false, instance);
                    }}
                    onClick={e => {
                      if (!clicked) {
                        activateInstances({active: true, clicked: true, lines: true}, instance);
                      } else {
                        activateInstances({active: false, clicked: false, lines: false}, instance);
                      }
                    }}
  />;
}

export default withData(InstanceBox);