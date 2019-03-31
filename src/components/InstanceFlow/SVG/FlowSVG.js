import React, {Component} from "react";
import {withData} from "../../DataProvider";
import SVGInstancePaths from "./SVGInstancePaths";
import SVGSankeys from "./SVGSankeys";

class FlowSVG extends Component {
  state = {
    svgElement: null
  };

  render() {
    const {instances, epochs} = this.props;
    const {boxElements, containerElements} = this.props.data;
    const {svgElement} = this.state;
    let svgBounds;
    return <svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                ref={e => e && !svgElement && this.setState({
                  svgElement: e
                })}>
      {svgElement &&
      (svgBounds = svgElement.getBoundingClientRect()) &&
      [
        <SVGSankeys key="svg-sankeys" epochs={epochs} svgBounds={svgBounds} containerElements={containerElements}/>,
        instances.filter(instance => instance.active && instance.lines).map(instance =>
          <SVGInstancePaths key={instance.id} instance={instance} epochs={epochs} svgBounds={svgBounds}
                            boxElements={boxElements}/>
        )
      ]}
    </svg>;
  }
}

export default withData(FlowSVG);