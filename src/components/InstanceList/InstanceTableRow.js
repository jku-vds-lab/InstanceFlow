import React, {Component} from "react";
import {withData} from "../DataProvider";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import "./InstanceTableRow.css";
import InstanceDistributionChart from "./InstanceDistributionChart";

class InstanceTableRow extends Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.instance !== nextProps.instance ||
      this.props.epochs !== nextProps.epochs ||
      this.props.data.activeInstances.has(this.props.instance.id) !== nextProps.data.activeInstances.has(nextProps.instance.id) ||
      this.props.data.clickedInstances.has(this.props.instance.id) !== nextProps.data.clickedInstances.has(nextProps.instance.id) ||
      this.props.classification !== nextProps.classification;
  }

  render() {
    const {instance, epochs} = this.props;
    const {getLabel, getColor, activeInstances, clickedInstances, activateInstances, deactivateInstances} = this.props.data;

    return <TableRow>
      <TableCell align="center" component="th" scope="row">
        {instance.id}
      </TableCell>
      <TableCell align="center">
        <img className={`box-img ${activeInstances.has(instance.id) ? "active" : ""}`} src={instance.image}
             data-id={instance.id}
             alt={`Instance ${instance.id}`}
             onMouseOver={e => {
               //if (!instance.clicked)
               //  activateInstances({lines: true}, instance)
             }}
             onMouseOut={e => {
               //if (!instance.clicked)
               //  deactivateInstances(false, instance);
             }}
             onClick={e => {
               if (!clickedInstances.has(instance.id)) {
                 activateInstances({clicked: true, lines: true}, instance);
               } else {
                 //activateInstances({clicked: false, lines: false}, instance);
                 deactivateInstances(true, instance);
               }
             }}/>
      </TableCell>
      <TableCell align="center" style={{
        color: getColor(instance.actual)
      }}>{getLabel(instance.actual)}</TableCell>
      <TableCell align="center" style={{width: "35%"}}>
        <InstanceDistributionChart instance={instance} epochs={epochs} />
      </TableCell>
      <TableCell align="center">{instance.classesVisitedNum}</TableCell>
      <TableCell align="center">{instance.frequency}</TableCell>
      <TableCell align="center">{instance.score}</TableCell>
    </TableRow>;
  }
}

export default withData(InstanceTableRow);