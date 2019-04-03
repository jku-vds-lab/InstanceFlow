import React from "react";
import ChangersEpoch from "./ChangersEpoch";
import {withData} from "../DataProvider";
import ReactTooltip from "react-tooltip";

const ChangersContainer = (props) => {
  const {epochs} = props;
  const {getClassesWithOther} = props.data;
  const classesWithOther = getClassesWithOther();
  if (getClassesWithOther().length !== 3) return <span>Please select two classes. </span>;
  return <div className="changers-container">
    <ReactTooltip effect="solid"/>
    {epochs.map(epoch =>
      <ChangersEpoch key={epoch.id} epoch={epoch} classes={classesWithOther}/>
    )}
  </div>
};


export default withData(ChangersContainer);