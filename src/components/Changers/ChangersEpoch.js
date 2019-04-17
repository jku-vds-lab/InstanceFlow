import React, {Component} from "react";
import ChangersBarSeparator from "./ChangersBarSeparator";
import ReactTooltip from "react-tooltip";
import ChangersClassBars from "./ChangersClassBars";

class ChangersEpoch extends Component {
  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  componentDidMount() {
    ReactTooltip.rebuild()
  }

  render() {
    const {epoch, classes} = this.props;
    for (const clazz of classes) {
      if (!epoch.stats[clazz.toString()]) return null;
    }

    return <div className="changers-epoch">
        <ChangersClassBars epoch={epoch} current={classes[0]} top={classes[2]} bottom={classes[1]}/>
        <ChangersBarSeparator/>
        <ChangersClassBars epoch={epoch} isOther={true} current={classes[1]} top={classes[0]} bottom={classes[2]}/>
        <ChangersBarSeparator/>
        <ChangersClassBars epoch={epoch} current={classes[2]} top={classes[1]} bottom={classes[0]}/>
      </div>;
  }
}


export default ChangersEpoch;