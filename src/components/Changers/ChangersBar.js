import React from "react";

const ChangersBar = (props) => {
  const {height, color, opacity, description} = props;
  if(!height) return null;
  return <div data-tip={height + " " + description}
              className="changers-bar"
              style={{flexGrow: height, backgroundColor: color, opacity: opacity}}/>;
};

export default ChangersBar;