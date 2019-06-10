import React, {useState, createContext, useEffect} from "react";
import ReactTooltip from "react-tooltip";

const FlowDataContext = createContext({});

const FlowDataProvider = (props) => {
  const [opacityMetric, setOpacityMetric] = useState("score");
  const [classView, setClassView] = useState("overview");
  const [sankeyEnabled, setSankeyEnabled] = useState(true);
  const [boxElements, setBoxElements] = useState(new Map());
  const [containerElements, setContainerElements] = useState(new Map());

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [sankeyEnabled, classView]);

  return (
    <FlowDataContext.Provider value={{
      boxElements, setBoxElements, updateBoxElements: (instanceId, epochId, boxElement) => {
        setBoxElements(boxElements => {
          const res = new Map(boxElements);
          const curr = res.get(instanceId) || new Map();
          if (!boxElement) {
            curr.delete(epochId);
          } else {
            curr.set(epochId, boxElement);
          }
          res.set(instanceId, curr);
          return res;
        });
      },
      containerElements, setContainerElements, updateContainerElements: (clazz, epochId, containerElement) => {
        setContainerElements(containerElements => {
          const res = new Map(containerElements);
          const curr = res.get(clazz) || new Map();
          if (!containerElement) {
            curr.delete(epochId);
          } else {
            curr.set(epochId, containerElement);
          }
          res.set(clazz, curr);
          return res;
        });
      },
      opacityMetric, setOpacityMetric,
      classView, setClassView,
      sankeyEnabled, setSankeyEnabled
    }}>
      {props.children}
    </FlowDataContext.Provider>
  )
};

const FlowDataConsumer = FlowDataContext.Consumer;

export {FlowDataProvider, FlowDataConsumer, FlowDataContext}

export function withFlowData(MyComponent) {
  class WithFlowData extends React.Component {
    render() {
      const {forwardedRef, ...rest} = this.props;
      return (
        <FlowDataConsumer>
          {(flowData) =>
            <MyComponent {...rest}
                         ref={forwardedRef}
                         flowData={flowData}/>
          }
        </FlowDataConsumer>);
    }
  }

  return React.forwardRef((props, ref) => {
    return (<WithFlowData {...props} forwardedRef={ref}/>);
  });
}
