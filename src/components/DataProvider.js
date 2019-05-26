import React, {useState, createContext, useEffect} from "react";
import ReactTooltip from "react-tooltip";

const DataContext = createContext({});

const DataProvider = (props) => {
  const [sortMetric, setSortMetric] = useState("score");
  const [opacityMetric, setOpacityMetric] = useState("score");
  const [data, setData] = useState(null);
  const [epochs, setEpochs] = useState([]);
  const [instances, setInstances] = useState([]);
  const [instanceFilter, setInstanceFilter] = useState("incorrect");
  const [visibleInstances, setVisibleInstances] = useState(new Set());
  const [activeInstances, setActiveInstances] = useState(new Set());
  const [lineInstances, setLineInstances] = useState(new Set());
  const [clickedInstances, setClickedInstances] = useState(new Set());
  const [classes, setClasses] = useState([3, 5]);
  const [from, setFrom] = useState(20);
  const [to, setTo] = useState(25);
  const [loading, setLoading] = useState(false);
  const [maxInstancesPerPredictionPerClass, setMaxInstancesPerPredictionPerClass] = useState(0);
  const [maxInstancesPerPrediction, setMaxInstancesPerPrediction] = useState(0);
  const [colors, setColors] = useState(["#ff0029", "#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "lightgray"]);

  // sleep time expects milliseconds
  //function sleep(time) {
  //  return new Promise((resolve) => setTimeout(resolve, time));
  //}

  useEffect(() => {
    //sleep(0).then(() => initializeData(datasets.CIFAR10));
    //initializeData(datasets.CIFAR10);
    fetch(`datasets/cifar10.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then(json => {
        initializeData(json);
      })
      .catch(error => {
        console.log(error);
      })
  }, []);

  useEffect(() => {
    if(data) {
      setEpochs(prepareEpochs(data, classes, from, to, visibleInstances));
    }
  }, [data, classes, from, to, visibleInstances]);

  useEffect(() => {
    if (data) {
      setInstances(
        sortInstances(
          data.instances
            .map((instance, index) => {
              instance.index = index;
              return instance;
            })
            .filter(instance => instance.display)
            .map(instance => {
              instance.visible = visibleInstances.has(instance.id);
              instance.active = activeInstances.has(instance.id);
              instance.line = lineInstances.has(instance.id);
              instance.clicked = clickedInstances.has(instance.id);
              return instance;
            })));
    }
  }, [epochs, instanceFilter, sortMetric, activeInstances, clickedInstances, lineInstances]);

  useEffect(() => {
    setLoading(false);
    setTimeout(() => {
      ReactTooltip.rebuild();
    }, 100);
  }, [instances]);

  //useEffect(() => {
  //  setInstances(instances => instances.map(instance => ({
  //    ...instance,
  //    active: activeInstances.has(instance.id),
  //    lines: lineInstances.has(instance.id),
  //    clicked: clickedInstances.has(instance.id)
  //  })));
  //}, [activeInstances]);

  const initializeData = (data) => {
    if(!data) {
      setData(null);
    } else {
      setData(annotateInstanceData(data));
    }
  };

  const sortInstances = (instances) => {
    return instances.sort((i1, i2) => {
      return i2[sortMetric] - i1[sortMetric] || i1.actual - i2.actual || 0;
    });
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

  const prepareEpochs = (data, classes, from, to, visibleInstances) => {
    // Select the epochs
    const slicedEpochs = data.epochs.slice(from, to + 1);

    // Update meta information of instances with selected epochs
    prepareInstanceMeta(data);
    annotateInstanceMeta(data, slicedEpochs, visibleInstances);
    // Prepare epoch meta array
    prepareEpochMeta(classes, slicedEpochs);
    annotateEpochMeta(slicedEpochs);
    return slicedEpochs;
  };

  const prepareInstanceMeta = (data) => {
    data.instances.forEach(instance => {
      instance.score = 0;
      instance.display = false;
    });
  };

  const annotateInstanceMeta = (data, epochs, visibleInstances) => {
    data.instances.forEach((instance, iIndex) => {
      let wrong = 0, jumps = 0;
      let classesVisited = new Set();
      epochs.forEach((epoch, eIndex) => {
        const classification = epoch.classifications[iIndex];
        // Count incorrect
        if (!classification.isCorrect) wrong++;
        // Count jumps
        if (eIndex + 1 < epochs.length) {
          const type = classification.type;
          if (type === "out" || type === "inout") {
            jumps++;
          }
        }
        // Count classes visited
        classesVisited.add(classification.predicted);
      });
      instance.classesVisited = classesVisited;
      instance.score = Math.round(wrong / epochs.length * 100) / 100;
      instance.frequency = Math.round(jumps / (epochs.length - 1) * 100) / 100;
      instance.classesVisitedNum = Math.round(classesVisited.size / data.labels.length * 100) / 100;
      if (instanceFilter === "incorrect") {
        instance.displayInFlow = wrong > 0 && classes.includes(instance.actual);
        instance.displayInList = instance.displayInFlow;
      } else if (instanceFilter === "active") {
        instance.displayInFlow = visibleInstances.has(instance.id) && classes.includes(instance.actual);
        instance.displayInList = wrong > 0 && classes.includes(instance.actual);
      } else if (instanceFilter === "all") {
        instance.displayInFlow = classes.includes(instance.actual);
        instance.displayInList = classes.includes(instance.actual);
      }
      instance.display = instance.displayInFlow || instance.displayInList;
      instance.displayInStats = instance.displayInFlow;
    });
  };

  const prepareEpochMeta = (classes, epochs) => {
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

  const annotateEpochMeta = (epochs) => {
    let maxInstancesPerPredictionPerClassTemp = 0;
    let maxInstancesPerPredictionTemp = 0;
    epochs.forEach((epoch, eIndex) => {
      epoch.classifications.forEach((classification, cIndex) => {
        let nextClassification;
        //let previousClassification;
        if (epochs[eIndex + 1])
          nextClassification = epochs[eIndex + 1].classifications[cIndex];
        //if (epochData[eIndex - 1])
        //  previousClassification = epochData[eIndex - 1].classifications[cIndex];

        const instance = data.instances[cIndex];

        if (instance.displayInStats) {
          const instanceStats = epoch.stats[getIncludedOrOtherIndex(classification.predicted)];
          instanceStats.total = (instanceStats.total || 0) + 1;
          if (classes.includes(instance.actual) && maxInstancesPerPredictionTemp < instanceStats.total) {
            maxInstancesPerPredictionTemp = instanceStats.total;
          }


          instanceStats.predicted[getIncludedOrOtherIndex(instance.actual)] =
            (instanceStats.predicted[getIncludedOrOtherIndex(instance.actual)] || 0) + 1;
          if (classes.includes(instance.actual) && maxInstancesPerPredictionPerClassTemp < instanceStats.predicted[getIncludedOrOtherIndex(instance.actual)]) {
            maxInstancesPerPredictionPerClassTemp = instanceStats.predicted[getIncludedOrOtherIndex(instance.actual)];
          }


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
    setMaxInstancesPerPredictionPerClass(maxInstancesPerPredictionPerClassTemp);
    setMaxInstancesPerPrediction(maxInstancesPerPredictionTemp);
  };

  const getIncludedOrOtherIndex = (index) => {
    return (classes.includes(index) ? index : getOtherClassIndex());
  };

  const getIncludedOrOtherColor = (index) => {
    return (classes.includes(index) ? getColor(index) : getColor(getOtherClassIndex()));
  };

  const getClassesWithOther = () => {
    if(!data) return [];
    if (classes.length === data.labels.length) return classes;
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
    return colors[index];
  };

  return (
    <DataContext.Provider value={{
      raw_data: data,
      initializeData,
      to, setTo,
      from, setFrom,
      classes, setClasses,
      visibleInstances, setVisibleInstances,
      activeInstances,
      clickedInstances,
      lineInstances,
      labels: data ? data.labels : [],
      labelsWithOther: data ? [...data.labels, "Other"] : [],
      epochs, setEpochs,
      instances, setInstances,
      updateInstance: (instance, props) => {
        setInstances(instances => instances.map(i => i.id === instance.id ? {
          ...i,
          ...props
        } : i));
      },
      activateInstances: (config = {}, ...instances) => {
        if(config.visible !== undefined) {
          setVisibleInstances(visibleInstances => {
            const res = new Set(visibleInstances);
            instances.forEach(instance => config.visible ? res.add(instance.id) : res.delete(instance.id));
            return res;
          });
        }
        if(config.active !== undefined) {
          setActiveInstances(activeInstances => {
            const res = new Set(activeInstances);
            instances.forEach(instance => config.active ? res.add(instance.id) : res.delete(instance.id));
            return res;
          });
        }
        if (config.lines !== undefined)
          setLineInstances(lineInstances => {
            const res = new Set(lineInstances);
            instances.forEach(instance => config.lines ? res.add(instance.id) : res.delete(instance.id));
            return res;
          });
        if (config.clicked !== undefined)
          setClickedInstances(clickedInstances => {
            const res = new Set(clickedInstances);
            instances.forEach(instance => config.clicked ? res.add(instance.id) : res.delete(instance.id));
            return res;
          });
        //setInstances(sortInstances(instances));
      },
      deactivateAllInstances: () => {
        //setVisibleInstances(new Set());
        setActiveInstances(new Set());
        setLineInstances(new Set());
        setClickedInstances(new Set());
      },
      deactivateInstances: (force = false, ...instances) => {
        const nonClickedInstances = instances
          .filter(instance => {
            return !instance.clicked || force
          });
        //setVisibleInstances(visibleInstances => {
        //  const res = new Set(visibleInstances);
        //  nonClickedInstances
        //    .forEach(instance => res.delete(instance.id));
        //  return res;
        //});
        setActiveInstances(activeInstances => {
          const res = new Set(activeInstances);
          nonClickedInstances
            .forEach(instance => res.delete(instance.id));
          return res;
        });
        setLineInstances(lineInstances => {
          const res = new Set(lineInstances);
          nonClickedInstances
            .forEach(instance => res.delete(instance.id));
          return res;
        });
        setClickedInstances(clickedInstances => {
          const res = new Set(clickedInstances);
          nonClickedInstances
            .forEach(instance => res.delete(instance.id));
          return res;
        })
      },
      maxInstancesPerPredictionPerClass,
      maxInstancesPerPrediction,
      loading,
      colors, setColors,
      sortMetric, setSortMetric,
      opacityMetric, setOpacityMetric,
      instanceFilter, setInstanceFilter,
      getLabel,
      getColor,
      getIncludedOrOtherColor,
      getClassesWithOther,
      getIncludedOrOtherIndex
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
