import React, {useState} from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {withStyles} from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FileMenu from "./FileMenu";
import Dialog from "@material-ui/core/Dialog/Dialog";

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  }
};

const AppToolbar = (props) => {
  const {classes: style, infoDialogContent} = props;
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  return <div className={style.root}>
    <Dialog
      open={descriptionModalOpen}
      onClose={() => setDescriptionModalOpen(false)}
    >
      {infoDialogContent && infoDialogContent}
    </Dialog>
    <AppBar position="static" style={{marginBottom: "10px"}}>
      <Toolbar>
        {/*<IconButton className={style.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon/>
        </IconButton>*/}
        <FileMenu/>
        <Typography variant="h6" color="inherit" className={style.grow}></Typography>
        <IconButton color="inherit" aria-label="Information" onClick={() => setDescriptionModalOpen(true)}>
          <InfoOutlinedIcon/>
        </IconButton>
      </Toolbar>
    </AppBar>
  </div>;
};

export default withStyles(styles)(AppToolbar);