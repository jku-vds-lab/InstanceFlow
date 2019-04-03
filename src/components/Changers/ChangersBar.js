import React from "react";

const ChangersBar = (props) => {
  const {height, color, description} = props;
  return <div data-tip={height + " " + description}
              className="changers-bar"
              style={{flexGrow: height, backgroundColor: color}}/>;
};

export default ChangersBar;