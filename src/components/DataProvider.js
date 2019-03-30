import React, {useState, createContext, useEffect} from "react";
import datasets from "../data/data.js";

const DataContext = createContext({});

const DataProvider = (props) => {
  const [data, setData] = useState(null);
  const [epochs, setEpochs] = useState([]);
  const [classes, setClasses] = useState([3, 5]);
  const [from, setFrom] = useState(20);
  const [to, setTo] = useState(25);

  useEffect(() => {
    console.log("EXE");
    setData(initializeData(datasets.CIFAR10));
  }, []);

  useEffect(() => {
    console.log("ALL");
    if (data)
      prepareEpochs();
  }, [data, from, to, classes]);

  const initializeData = (data) => {
    return annotateInstanceData(data);
  };

  const annotateInstanceData = (data) => {
    data.epochs.forEach((epoch, eIndex) => {
      epoch.classifications.forEach((classIndex, cIndex) => {
        // Swap the class-index reference with an actual object for easier processing
        const instance = data.instances[cIndex];
        const classification = {
          predicted: classIndex
        };
        epoch.classifications[cIndex] = classification;
        const isCorrect = (predicted, instance) => {
          return predicted === instance.actual;
        };
        const isWrong = (predicted, instance) => {
          return predicted !== instance.actual && classes.includes(predicted);
        };
        const isOther = (predicted, instance) => {
          return !isCorrect(predicted, instance) && !classes.includes(predicted);
        };
        classification.isCorrect = isCorrect(classification.predicted, instance);
        classification.isWrong = isWrong(classification.predicted, instance);
        classification.isOther = isOther(classification.predicted, instance);

        let _out = false;
        let _in = false;

        // if another epoch exists
        if (data.epochs[eIndex + 1]) {
          // TODO: Here, you are not allowed to use .predicted, as it does not exist yet!
          const predictionInNextEpoch = data.epochs[eIndex + 1].classifications[cIndex];
          _out = classification.predicted !== predictionInNextEpoch;
        }
        // if a previous epoch exists
        if (data.epochs[eIndex - 1]) {
          const classificationInPreviousEpoch = data.epochs[eIndex - 1].classifications[cIndex];
          _in = classification.predicted !== classificationInPreviousEpoch.predicted;
        }

        if (_out && _in) {
          classification.type = "inout";
        } else if (_out) {
          classification.type = "out";
        } else if (_in) {
          classification.type = "in";
        } else {
          classification.type = "stable";
        }
      });
    });
    return data;
  };

  const prepareEpochs = () => {
    // Select the epochs
    const slicedEpochs = data.epochs.slice(from, to + 1);

    // Update meta information of instances with selected epochs
    prepareInstanceMeta();
    annotateInstanceMeta(slicedEpochs);
    // Prepare epoch meta array
    prepareEpochMeta(slicedEpochs);
    annotateEpochMeta(slicedEpochs);

    setEpochs(slicedEpochs);
  };

  const prepareInstanceMeta = () => {
    data.instances.forEach(instance => {
      instance.score = 0;
      instance.display = false;
    });
  };

  const annotateInstanceMeta = (epochs) => {
    data.instances.forEach((instance, iIndex) => {
      let total = 0, wrong = 0, jumps = 0;
      let classesVisited = new Set();
      epochs.forEach(epoch => {
        const classification = epoch.classifications[iIndex];
        // Count total
        total++;
        // Count incorrect
        if (!classification.isCorrect) wrong++;
        // Count jumps
        const type = classification.type;
        if (type === "out" || type === "inout") {
          jumps++;
        }
        // Count classes visited
        classesVisited.add(classification.predicted);
      });
      instance.classesVisited = classesVisited;
      instance.score = Math.round(wrong / total * 100) / 100;
      instance.variability = Math.round(jumps / total * 100) / 100;
      instance.classesVisitedNum = Math.round(classesVisited.size / data.labels.length * 100) / 100;
      instance.display = wrong > 0 && classes.includes(instance.actual);
    });
  };

  const prepareEpochMeta = (epochs) => {
    epochs.forEach(epoch => {
      epoch.stats = {};

      const createNewEmptyStatsObj = () => {
        return {
          from: {},
          predicted: {},
          to: {},
          in: {total: 0},
          inout: {total: 0},
          out: {total: 0},
          stable: {total: 0},
        };
      };

      classes.forEach(classIndex => {
        epoch.stats[classIndex] = createNewEmptyStatsObj();
      });
      epoch.stats[getOtherClassIndex()] = createNewEmptyStatsObj();
    });
  };

  const annotateEpochMeta = (epochData) => {
    epochData.forEach((epoch, eIndex) => {
      epoch.classifications.forEach((classification, cIndex) => {
        let nextClassification;
        let previousClassification;
        if (epochData[eIndex + 1])
          nextClassification = epochData[eIndex + 1].classifications[cIndex];
        if (epochData[eIndex - 1])
          previousClassification = epochData[eIndex - 1].classifications[cIndex];

        const instance = data.instances[cIndex];

        if (instance.display) {
          const instanceStats = epoch.stats[getIncludedOrOtherIndex(classification.predicted)];
          instanceStats.total = (instanceStats.total || 0) + 1;

          instanceStats.predicted[getIncludedOrOtherIndex(instance.actual)] =
            (instanceStats.predicted[getIncludedOrOtherIndex(instance.actual)] || 0) + 1;

          if (nextClassification) {
            if (!instanceStats.to[getIncludedOrOtherIndex(nextClassification.predicted)]) {
              instanceStats.to[getIncludedOrOtherIndex(nextClassification.predicted)] = {
                total: 0
              };
            }

            instanceStats.to[getIncludedOrOtherIndex(nextClassification.predicted)][getIncludedOrOtherIndex(instance.actual)] =
              (instanceStats.to[getIncludedOrOtherIndex(nextClassification.predicted)][getIncludedOrOtherIndex(instance.actual)] || 0) + 1;
            instanceStats.to[getIncludedOrOtherIndex(nextClassification.predicted)].total++;
          }

          instanceStats[classification.type][getIncludedOrOtherIndex(instance.actual)] =
            (instanceStats[classification.type][getIncludedOrOtherIndex(instance.actual)] || 0) + 1;
          instanceStats[classification.type].total++;
        }
      });
    });
  };

  const getIncludedOrOtherIndex = (index) => {
    return (classes.includes(index) ? index : getOtherClassIndex());
  };

  const getIncludedOrOtherColor = (index) => {
    return (classes.includes(index) ? getColor(index) : getColor(getOtherClassIndex()));
  };

  const getDefaultClassesWithOther = () => {
    const newClasses = [...classes];
    newClasses.splice(parseInt(classes.length / 2), 0, 10);
    return newClasses;
  };

  const getOtherClassIndex = () => {
    return data.labels.length;
  };

  const getLabel = (index) => {
    return (data.labels[index] || "Other");
  };

  const getColor = (index) => {
    return ["#ff0029", "#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "lightgray"][index];
  };

  return (
    <DataContext.Provider value={{
      data, setData,
      to, setTo,
      from, setFrom,
      classes, setClasses,
      epochs, setEpochs,
      getLabel,
      getColor,
      getIncludedOrOtherColor
    }}>
      {props.children}
    </DataContext.Provider>
  )
};
const DataConsumer = DataContext.Consumer;

export {DataProvider, DataConsumer}

export function withData(MyComponent) {
  class WithData extends React.Component {
    render() {
      const {forwardedRef, ...rest} = this.props;
      return (
        <DataConsumer>
          {(data) =>
            <MyComponent {...rest}
                         ref={forwardedRef}
                         data={data}/>
          }
        </DataConsumer>);
    }
  }

  return React.forwardRef((props, ref) => {
    return (<WithData {...props} forwardedRef={ref}/>);
  });
}