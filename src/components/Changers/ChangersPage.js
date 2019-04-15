import React, {Component} from "react";
import {withData} from "../DataProvider";
import "./ChangersPage.css";
import Legend from "../Controls/Legend";
import ChangersContainer from "../Changers/ChangersContainer";
import AllControls from "../Controls/AllControls";
import Grid from "@material-ui/core/Grid/Grid";
import AppToolbar from "../Toolbar/AppToolbar";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";

class ChangersPage extends Component {
  render() {
    //console.log("MainPage");
    const {epochs, loading, labelsWithOther, colors} = this.props.data;

    const infoDialogContent = <div>
      <DialogTitle>Changers View For Two Classes</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
      </DialogContent>
    </div>;
    return <div>
      <AppToolbar infoDialogContent={infoDialogContent}/>
      <Grid container justify="space-between">
        <Grid item sm>
          <AllControls showEpochSelector={true}
                       showClassSelector={true}
                       showInstanceFilterSelector={true}
          />
        </Grid>
        <Grid item sm={4} md={2}>
          <Legend labels={labelsWithOther} colors={colors} showTypes={true}/>
        </Grid>
      </Grid>
      {!loading && <ChangersContainer epochs={epochs}/>}
    </div>;
  }
}

export default withData(ChangersPage);