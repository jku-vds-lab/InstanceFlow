import React, {PureComponent} from "react";
import "./SimpleBox.css";

class SimpleBox extends PureComponent {
  render() {
    const {type, color, tooltipText, style, onMouseOver, onClick, onMouseOut, refCallback, opacity} = this.props;

    return <div className={`box tooltip-container ${type}`}
                style={{
                  ...style,
                  "--box-color": color,
                  opacity: opacity
                }}
                ref={refCallback}
                onMouseOver={e => onMouseOver && onMouseOver(e)}
                onClick={e => onClick && onClick(e)}
                onMouseOut={e => onMouseOut && onMouseOut(e)}
    >
      {tooltipText && <div className="tooltip-text">{tooltipText}</div>}
    </div>;
  }
}

SimpleBox.defaultProps = {
  opacity: 1.0
};

export default SimpleBox;