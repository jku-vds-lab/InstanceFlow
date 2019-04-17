import React, {Component} from "react";
import {withData} from "../DataProvider";
import "./ChangersPage.css";
import Legend from "../Controls/Legend";
import ChangersContainer from "../Changers/ChangersContainer";
import AllControls from "../Controls/AllControls";
import Grid from "@material-ui/core/Grid/Grid";
import AppToolbar from "../Toolbar/AppToolbar";

class ChangersPage extends Component {
  componentDidMount() {
    document.title = "ClassFlow";
  }

  render() {
    //console.log("MainPage");
    const {epochs, loading, labelsWithOther, colors} = this.props.data;

    const infoDialogContent = <>
      Description.. TODO
    </>;
    return <div>
      <AppToolbar title="ClassFlow" infoDialogTitle="Changers View For Two Classes" infoDialogContent={infoDialogContent}/>
      <Grid container justify="space-between">
        <Grid item sm>
          <AllControls showEpochSelector={true}
                       showClassSelector={true}
                       showInstanceFilterSelector={true}
          />
        </Grid>
        <Grid item sm={2} md={1}>
          <Legend labels={labelsWithOther} colors={colors} showTypes={false}/>
        </Grid>
      </Grid>
      {!loading && <ChangersContainer epochs={epochs}/>}
    </div>;
  }
}

export default withData(ChangersPage);