import React, {Component} from "react";
import ChangersBar from "./ChangersBar";
import {withData} from "../DataProvider";
import ChangersBarSeparator from "./ChangersBarSeparator";
import ReactTooltip from "react-tooltip";

class ChangersEpoch extends Component {
  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  componentDidMount() {
    ReactTooltip.rebuild()
  }

  render() {
    const {epoch, classes} = this.props;
    const {getColor, getLabel} = this.props.data;
    for (const clazz of classes) {
      if (!epoch.stats[clazz.toString()]) return null;
    }
    return <div className="changers-epoch">
      <ChangersBar
        description={`Instances moving from ${getLabel(classes[0])} to ${getLabel(classes[2])}`}
        height={(epoch.stats[classes[0]].to[classes[2]] || {}).total}
        color={getColor(classes[2])}/>
      <ChangersBar
        description={`Instances staying in ${getLabel(classes[0])}`}
        height={epoch.stats[classes[0]].in.total + epoch.stats[classes[0]].stable.total}
        color={getColor(classes[1])}/>
      <ChangersBar
        description={`Instances moving from ${getLabel(classes[0])} to ${getLabel(classes[1])}`}
        height={(epoch.stats[classes[0]].to[classes[1]] || {}).total}
        color={getColor(classes[0])}/>
      <ChangersBarSeparator/>
      <ChangersBar
        description={`Instances moving from ${getLabel(classes[1])} to ${getLabel(classes[0])}`}
        height={(epoch.stats[classes[1]].to[classes[0]] || {}).total}
        color={getColor(classes[0])}/>
      <ChangersBar
        description={`Instances staying in ${getLabel(classes[1])}`}
        height={epoch.stats[classes[1]].in.total + epoch.stats[classes[1]].stable.total}
        color={getColor(classes[1])}/>
      <ChangersBar
        description={`Instances moving from ${getLabel(classes[1])} to ${getLabel(classes[2])}`}
        height={(epoch.stats[classes[1]].to[classes[2]] || {}).total}
        color={getColor(classes[2])}/>
      <ChangersBarSeparator/>
      <ChangersBar
        description={`Instances moving from ${getLabel(classes[2])} to ${getLabel(classes[1])}`}
        height={(epoch.stats[classes[2]].to[classes[1]] || {}).total}
        color={getColor(classes[2])}/>
      <ChangersBar
        description={`Instances staying in ${getLabel(classes[2])}`}
        height={epoch.stats[classes[2]].in.total + epoch.stats[classes[2]].stable.total}
        color={getColor(classes[1])}/>
      <ChangersBar
        description={`Instances moving from ${getLabel(classes[2])} to ${getLabel(classes[0])}`}
        height={(epoch.stats[classes[2]].to[classes[0]] || {}).total}
        color={getColor(classes[0])}/>
    </div>
  }
}


export default withData(ChangersEpoch);