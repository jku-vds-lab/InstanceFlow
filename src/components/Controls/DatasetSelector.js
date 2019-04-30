import React from "react";
import Slider, {Range} from "rc-slider";
import {withData} from "../DataProvider";
import 'rc-slider/assets/index.css';
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import {withStyles} from "@material-ui/core";
import Select from "@material-ui/core/Select/Select";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Chip from "@material-ui/core/Chip/Chip";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Input from "@material-ui/core/Input/Input";

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3,
  },
});

const names = [
  'Dataset #2',
  'Dataset #1',
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const DatasetSelector = (props) => {
  const {classes} = props;

  const handleChange = event => {
    //this.setState({name: event.target.value});
  };

  const handleChangeMultiple = event => {
    const {options} = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    //this.setState({
    //  name: value,
    //});
  };

  return <FormControl fullWidth className={classes.formControl}>
    <InputLabel htmlFor="select-multiple-datasets">Datasets</InputLabel>
    <Select
      multiple
      value={[]}
      onChange={handleChange}
      input={<Input id="select-multiple-datasets"/>}
      renderValue={selected => (
        <div className={classes.chips}>
          {selected.map(value => (
            <Chip key={value} label={value} className={classes.chip}/>
          ))}
        </div>
      )}
      MenuProps={MenuProps}
    >
      {names.map(name => (
        <MenuItem key={name} value={name}>
          {name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>;
};

export default withStyles(styles, {withTheme: true})(withData(DatasetSelector));