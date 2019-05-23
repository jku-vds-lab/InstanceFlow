import React from "react";
import {withData} from "../DataProvider";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import Grid from "@material-ui/core/Grid/Grid";

const ClassSelector = (props) => {
  const {labels, classes, setClasses, getColor} = props.data;
  if(labels.length === 0) return null;
  return <FormControl fullWidth component="fieldset">
    <FormLabel component="legend">Classes to Display</FormLabel>
    <FormGroup row style={{marginLeft: "8px"}}>
      <Grid container spacing={16}>
        {labels.map((label, labelIndex) =>
          <Grid key={label} item>
            <FormControlLabel
              control={
                <Checkbox
                  style={{padding: 3}}
                  icon={<CheckBoxOutlineBlankIcon nativeColor={getColor(labelIndex)} style={{padding: 0}}
                                                  fontSize="small"/>}
                  checkedIcon={<CheckBoxIcon nativeColor={getColor(labelIndex)} style={{padding: 0}} fontSize="small"/>}
                  checked={classes.includes(labelIndex)}
                  onChange={e => !e.target.checked ?
                    setClasses(classes => classes.filter(clazz => clazz !== parseInt(e.target.value))) :
                    setClasses(classes => [...classes, parseInt(e.target.value)].sort())}
                  value={labelIndex.toString()}/>
              }
              label={label}
            /></Grid>
        )}
      </Grid>
    </FormGroup>
    <FormHelperText></FormHelperText>
  </FormControl>;

};

export default withData(ClassSelector);