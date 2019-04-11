import React, {Component} from "react";
import InstanceList from "./InstanceList/InstanceList";
import {withData} from "./DataProvider";
import "./MainPage.css";
import Legend from "./Controls/Legend";
import InstanceFlow from "./InstanceFlow/InstanceFlow";
import {FlowDataProvider} from "./InstanceFlow/FlowDataProvider";
import AllControls from "./Controls/AllControls";

class MainPage extends Component {
  render() {
    //console.log("MainPage");
    const {epochs, instances, loading, labelsWithOther, colors} = this.props.data;
    return <FlowDataProvider>
      <h1>Evolution of Instance Classification</h1>
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
        <div>
          <h4>Controls</h4>
          <AllControls showDataUploadInput={true}
                       showEpochSelector={true}
                       showSortingSelector={true}
                       showOpacitySelector={true}
                       showClassSelector={true}
                       showClassViewSelector={true}
                       showInstanceFilterSelector={true}
                       showSankeyEnableCheckbox={true}
          />
        </div>
        <div style={{flex: 3}}>
          <h4>About</h4>
          <span>
          The following is a prototype showing instance classifications over a period of epochs.<br/>
          Two classes of the dataset are compared (here 3 and 8) and the classification is displayed below.<br/>
            {/*Wrongly classified instances are red, correct ones are green and wrong instances, where the predicted class is not 3
          or 8, are gray.<br>
          Hovering over an instance shows the evolution of this instance, clicking on it preserves the selection. The
          instances are sorted by their score, which is now
          just wrong / total classifications (the lower the better). <br/>*/}
            Additionally, a Sankey-Diagram is drawn to visualize the flow between the classes. <br/>
          The bigger the flow, the more instances changed from class to class. <br/>
          Each Sankey-Flow can be individually styled, such as <br/> making incorrect-to-correct flows more visible as in this
          example.
        </span>
        </div>
        <div>
          <h4>Legend</h4>
          <Legend labels={labelsWithOther} colors={colors} showTypes={true}/>
        </div>
      </div>
      {!loading && <InstanceFlow instances={instances} epochs={epochs}/>}
      {!loading && <InstanceList instances={instances} epochs={epochs}/>}
    </FlowDataProvider>;
  }
}

export default withData(MainPage);