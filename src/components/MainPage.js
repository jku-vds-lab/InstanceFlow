import React, {Component} from "react";
import InstanceList from "./InstanceList/InstanceList";
import {withData} from "./DataProvider";
import "./MainPage.css";
import Legend from "./Controls/Legend";
import InstanceFlow from "./InstanceFlow/InstanceFlow";
import {FlowDataProvider} from "./InstanceFlow/FlowDataProvider";
import AllControls from "./Controls/AllControls";
import AppToolbar from "./Controls/AppToolbar";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import Grid from "@material-ui/core/Grid/Grid";

class MainPage extends Component {
  render() {
    //console.log("MainPage");
    const {epochs, instances, loading, labelsWithOther, colors} = this.props.data;

    const hasData = !loading && instances && instances.length !== 0 && epochs;

    const infoDialogContent = <div>
      <DialogTitle>Evolution of Instance Classification</DialogTitle>
      <DialogContent>
        <DialogContentText>
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
        </DialogContentText>
      </DialogContent>
    </div>;
    return <div>
      <AppToolbar infoDialogContent={infoDialogContent}/>
      <FlowDataProvider>
        <Grid container justify="space-between">
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
          <Grid item sm={4} md={2}>
            <Legend labels={labelsWithOther} colors={colors} showTypes={true}/>
          </Grid>
        </Grid>
        {hasData && <InstanceFlow instances={instances} epochs={epochs}/>}
        {hasData && <InstanceList instances={instances} epochs={epochs}/>}
      </FlowDataProvider>
    </div>;
  }
}

export default withData(MainPage);