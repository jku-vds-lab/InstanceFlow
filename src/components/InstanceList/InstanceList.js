import React, {Component} from "react";
import "./InstanceList.css"
import {withFlowData} from "../InstanceFlow/FlowDataProvider";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import InstanceTableRow from "./InstanceTableRow";
import {withData} from "../DataProvider";

class InstanceList extends Component {
  render() {
    const {instances, epochs} = this.props;
    const {sortMetric} = this.props.flowData;
    const {clickedInstances} = this.props.data;
    return <div className="instance-list">
      <Table padding="dense">
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Image</TableCell>
            <TableCell align="center">Actual</TableCell>
            <TableCell align="center">Distribution</TableCell>
            <TableCell align="center">Variability</TableCell>
            <TableCell align="center">Frequency</TableCell>
            <TableCell align="center">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instances
            .filter(instance => instance.displayInList)
            .concat()
            .sort((i1, i2) => clickedInstances.has(i2.id) - clickedInstances.has(i1.id) || i2[sortMetric] - i1[sortMetric] || 0)
            .map(instance =>
              <InstanceTableRow key={instance.id} instance={instance} epochs={epochs}/>
            )}
        </TableBody>
      </Table>
    </div>;
  }
}

export default withFlowData(withData(InstanceList));