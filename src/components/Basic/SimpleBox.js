import React, {PureComponent} from "react";
import ReactTooltip from 'react-tooltip';
import "./SimpleBox.css";

class SimpleBox extends PureComponent {
  render() {
    const {type, color, tooltipText, style, onMouseOver, onClick, onMouseOut, refCallback, opacity} = this.props;

    return <div
        data-tip={tooltipText}
        className={`box ${type}`}
        style={{
          ...style,
          "--box-color": color,
          opacity: opacity
        }}
        ref={refCallback}
        onMouseOver={e => onMouseOver && onMouseOver(e)}
        onClick={e => onClick && onClick(e)}
        onMouseOut={e => onMouseOut && onMouseOut(e)}
      />;
  }
}

SimpleBox.defaultProps = {
  opacity: 1.0
};

export default SimpleBox;