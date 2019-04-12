import React from "react";
import {withData} from "../DataProvider";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import "./InstanceTableRow.css";

const InstanceTableRow = React.memo((props) => {
  const {instance, epochs} = props;
  const {getLabel, getColor, activateInstances, deactivateInstances} = props.data;

  const distributionPairs = epochs.reduce((acc, curr) => {
    const predicted = curr.classifications[instance.index].predicted;
    const lastIndex = acc.length - 1;
    const lastElement = acc[lastIndex];

    if (lastElement !== undefined && predicted === lastElement[0]) {
      lastElement[1]++;
    } else {
      acc.push([predicted, 1]);
    }
    return acc;
  }, []);

  return <TableRow>
    <TableCell align="center" component="th" scope="row">
      {instance.id}
    </TableCell>
    <TableCell align="center">
      <img className={`box-img ${instance.active ? "active" : ""}`} src={instance.image} data-id={instance.id}
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
             if (!instance.clicked) {
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
      <div className="bar-chart-container" style={{
        display: "flex"
      }}>
        {distributionPairs.map((pair, i) =>
          <div key={i}
               data-tip={`${pair[1]} ${getLabel(pair[0])}(s)`}
               className="bar-chart"
               style={{
                 flex: pair[1],
                 height: "20px",
                 //"--box-color": getIncludedOrOtherColor(pair[0])
                 "--box-color": getColor(pair[0])
               }}/>
        )}</div>
    </TableCell>
    <TableCell align="center">{instance.classesVisitedNum}</TableCell>
    <TableCell align="center">{instance.variability}</TableCell>
    <TableCell align="center">{instance.score}</TableCell>
  </TableRow>;
});

export default withData(InstanceTableRow);