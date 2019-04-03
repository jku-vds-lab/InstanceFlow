import React, {Component} from "react";
import EpochSelector from "../Controls/EpochSelector";
import {withData} from "../DataProvider";
import "./ChangersPage.css";
import ClassSelector from "../Controls/ClassSelector";
import Legend from "../Controls/Legend";
import ChangersContainer from "../Changers/ChangersContainer";

class ChangersPage extends Component {
  render() {
    //console.log("MainPage");
    const {epochs, loading, labelsWithOther, colors} = this.props.data;
    return <div>
      <h1>Changers View For Two Classes</h1>
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
        <div>
          <h4>Controls</h4>
          <div className="controls-grid">
            <span>Epochs:</span>
            <EpochSelector style={{gridRowStart: 1, gridRowEnd: 2}}/>
            <span>Classes:</span>
            <ClassSelector/>
          </div>
        </div>
        <div style={{flex: 3}}>
          <h4>About</h4>
          <span>
            Description...
        </span>
        </div>
        <div>
          <h4>Legend</h4>
          <Legend labels={labelsWithOther} colors={colors}/>
        </div>
      </div>
      {!loading && <ChangersContainer epochs={epochs}/>}
    </div>;
  }
}

export default withData(ChangersPage);