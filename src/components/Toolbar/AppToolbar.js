import React, {useState} from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {withStyles} from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FileMenu from "./FileMenu";
import Dialog from "@material-ui/core/Dialog/Dialog";
import ViewMenu from "./ViewMenu";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  }
};

const AppToolbar = (props) => {
  const {classes: style, infoDialogTitle, infoDialogContent} = props;
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  return <div className={style.root}>
    <Dialog
      open={descriptionModalOpen}
      onClose={() => setDescriptionModalOpen(false)}
    >
      <DialogTitle>{infoDialogTitle} <img style={{float: "right", marginLeft: 32}} src="logo.gif" width="36px" height="36px" /></DialogTitle>
      <DialogContent>
        <DialogContentText>
          {infoDialogContent}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDescriptionModalOpen(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
    <AppBar position="static" style={{marginBottom: "10px"}} color="default">
      <Toolbar variant="dense">
        {/*<IconButton className={style.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon/>
        </IconButton>*/}
        <FileMenu/>
        <ViewMenu/>
        <Typography align="center" variant="h6" color="inherit" className={style.grow}>InstanceFlow</Typography>
        {infoDialogContent &&
        <IconButton color="inherit" aria-label="Information" onClick={() => setDescriptionModalOpen(true)}>
          <InfoOutlinedIcon/>
        </IconButton>}
      </Toolbar>
    </AppBar>
  </div>;
};

export default withStyles(styles)(AppToolbar);