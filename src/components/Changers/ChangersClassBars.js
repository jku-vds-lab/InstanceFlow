import React from "react";
import {withData} from "../DataProvider";
import ChangersBar from "./ChangersBar";

const ChangersClassBars = (props) => {
  const {current, top, bottom, epoch} = props;
  const {getLabel, getColor} = props.data;
  return <>
    <ChangersBar
      description={`${getLabel(top)} instances moving from ${getLabel(current)} to ${getLabel(top)}`}
      height={(epoch.stats[current].to[top] || {})[top]}
      color={getColor(top)}
      opacity={1}/>
    <ChangersBar
      description={`${getLabel(current)} instances moving from ${getLabel(current)} to ${getLabel(top)}`}
      height={(epoch.stats[current].to[top] || {})[current]}
      color={getColor(current)}
      opacity={1}/>
    <ChangersBar
      description={`${getLabel(bottom)} instances moving from ${getLabel(current)} to ${getLabel(top)}`}
      height={(epoch.stats[current].to[top] || {})[bottom]}
      color={getColor(bottom)}
      opacity={1}/>

    <ChangersBar
      description={`${getLabel(top)} instances staying in ${getLabel(current)}`}
      height={(epoch.stats[current].in[top] || 0) + (epoch.stats[current].stable[top] || 0)}
      color={getColor(top)}
      opacity={0.2}/>
    <ChangersBar
      description={`${getLabel(current)} instances staying in ${getLabel(current)}`}
      height={(epoch.stats[current].in[current] || 0) + (epoch.stats[current].stable[current] || 0)}
      color={getColor(current)}
      opacity={0.2}/>
    <ChangersBar
      description={`${getLabel(bottom)} instances staying in ${getLabel(current)}`}
      height={(epoch.stats[current].in[bottom] || 0) + (epoch.stats[current].stable[bottom] || 0)}
      color={getColor(bottom)}
      opacity={0.2}/>

    <ChangersBar
      description={`${getLabel(top)} instances moving from ${getLabel(current)} to ${getLabel(bottom)}`}
      height={(epoch.stats[current].to[bottom] || {})[top]}
      color={getColor(top)}
      opacity={1}/>
    <ChangersBar
      description={`${getLabel(current)} instances moving from ${getLabel(current)} to ${getLabel(bottom)}`}
      height={(epoch.stats[current].to[bottom] || {})[current]}
      color={getColor(current)}
      opacity={1}/>
    <ChangersBar
      description={`${getLabel(bottom)} instances moving from ${getLabel(current)} to ${getLabel(bottom)}`}
      height={(epoch.stats[current].to[bottom] || {})[bottom]}
      color={getColor(bottom)}
      opacity={1}/>
  </>
};

export default withData(ChangersClassBars);