import React, {Component} from "react";
import InstanceListLineUp from "./InstanceList/InstanceListLineUp";
import {withData} from "./DataProvider";
import "./MainPage.css";
import Legend from "./Controls/Legend";
import InstanceFlow from "./InstanceFlow/InstanceFlow";
import {FlowDataProvider} from "./InstanceFlow/FlowDataProvider";
import AllControls from "./Controls/AllControls";
import AppToolbar from "./Toolbar/AppToolbar";
import Grid from "@material-ui/core/Grid/Grid";
import ReactTooltip from "react-tooltip";

class MainPage extends Component {
  componentDidMount() {
    document.title = "InstanceFlow";
    ReactTooltip.rebuild();
  }

  render() {
    const {raw_data, epochs, instances, labelsWithOther, colors} = this.props.data;

    const hasData = Boolean(raw_data) && Boolean(instances) && instances.length !== 0 && Boolean(epochs);

    const infoDialogContent = <>
      The following is a prototype showing instance classifications over a period of epochs.
      Two classes of the dataset are compared (here 3 and 8) and the classification is displayed below.
      {/*Wrongly classified instances are red, correct ones are green and wrong instances, where the predicted class is not 3
          or 8, are gray.<br>
          Hovering over an instance shows the evolution of this instance, clicking on it preserves the selection. The
          instances are sorted by their score, which is now
          just wrong / total classifications (the lower the better). <br/>*/}
      Additionally, a Sankey-Diagram is drawn to visualize the flow between the classes.
      The bigger the flow, the more instances changed from class to class.
      Each Sankey-Flow can be individually styled, such as making incorrect-to-correct flows more visible as in this
      example.
    </>;
    return <div>
      <AppToolbar title="InstanceFlow" infoDialogTitle="Evolution of Instance Classification" infoDialogContent={infoDialogContent}/>
      <FlowDataProvider>
        <Grid container>
          <Grid item sm>
            <AllControls showEpochSelector={true}
                         showSortingSelector={true}
                         showOpacitySelector={true}
                         showClassSelector={true}
                         showClassViewSelector={true}
                         showInstanceFilterSelector={true}
                         showSankeyEnableCheckbox={true}
            />
          </Grid>
          <Grid item>
            <Legend labels={labelsWithOther} colors={colors} showTypes={true}/>
          </Grid>
        </Grid>
        {hasData && <InstanceFlow instances={instances} epochs={epochs}/>}
        {hasData && <InstanceListLineUp instances={instances} epochs={epochs}/>}
      </FlowDataProvider>
    </div>;
  }
}

export default withData(MainPage);