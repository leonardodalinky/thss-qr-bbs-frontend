import React, { useContext } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import ChatIcon from '@material-ui/icons/Chat';
import InfoIcon from '@material-ui/icons/Info';
import { Fab, createStyles, Avatar, useScrollTrigger, Slide, CssBaseline } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import StarIcon from '@material-ui/icons/Star';
import HistoryIcon from '@material-ui/icons/History';
import { SessionConsumer, SessionContext } from '../session/SessionProvider';
import { Link, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => createStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  fab: {
    position: 'fixed',
    bottom: '10vh',
    right: '5vw'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.palette.primary.dark
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.dark,
  },
  list_account: {
    width: 'auto'
  },
  list_account_avatar: {
    margin: 'auto',
    backgroundColor: theme.palette.primary.dark,
  },
  list_account_text: {
    textAlign: 'center',
    marginTop: '10px',
  }
}));

interface HSProps {
  children?: React.ReactElement;
}

function HideOnScroll(props: HSProps) {
  const { children } = props;
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function NavDrawer(props?: any) {
  const { anchor }: {anchor: Anchor} = props;

  const sessionValue = useContext(SessionContext);
  const history = useHistory();
  
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const click = toggleDrawer(anchor, true);

  // 上方导航栏
  const NavBar = (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={click}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              清软论坛
            </Typography>
            <Avatar className={classes.avatar}>
              <AccountCircleIcon />
            </Avatar>
            {/* 更改登陆后的用户名 */}
            <SessionConsumer>
              {
                (cont) => (
                <Button 
                color="inherit"
                onClick={() => {
                  if (cont.isLogin) {
                    history.push('/profile');
                  } else {
                    history.push('/login');
                  }
                }}
                >
                {(() => {
                  if (cont.isLogin) {
                    return cont.nickname;
                  } else {
                    return '登录';
                  }
                })()}
                </Button>
                )
              }
            </SessionConsumer>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />

    </React.Fragment>

  )

  const list_account = (
    <div className={classes.list_account}>
      <Avatar className={classes.list_account_avatar}>
        <AccountCircleIcon/>
      </Avatar>
      <SessionConsumer>
        {
          (cont) => (
            <div className={classes.list_account_text}>{(() => {
              if (!cont.isLogin) {
                return '账户未登录'
              } else {
                return cont.nickname;
              }
            })()}</div>
          )
        }
      </SessionConsumer>
    </div>
  )

  // 左侧抽屉列表中的内容
  const list = (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {list_account}
      <Divider />
      <List>
        <ListItem button key={'主页'} component={props => <Link to='/profile' {...props} />}>
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary={'主页'} />
        </ListItem>
        <ListItem button key={'帖子'} component={props => <Link to='/bbs' {...props} />}>
          <ListItemIcon><ChatIcon /></ListItemIcon>
          <ListItemText primary={'帖子'} />
        </ListItem>
        <ListItem button key={'收藏夹'} component={props => <Link to='/favor' {...props} />}>
          <ListItemIcon><StarIcon /></ListItemIcon>
          <ListItemText primary={'收藏夹'} />
        </ListItem>
        <ListItem button key={'浏览记录'} component={props => <Link to='/history' {...props} />}>
          <ListItemIcon><HistoryIcon /></ListItemIcon>
          <ListItemText primary={'浏览记录'} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key={'关于'} component={props => <Link to='/about' {...props} />}>
          <ListItemIcon><InfoIcon /></ListItemIcon>
          <ListItemText primary={'关于'} />
        </ListItem>
        {(() => {
          if (sessionValue.isLogin || sessionValue.isLogin_local()) {
            return (
              <ListItem button key={'退出登录'} onClick={() => { sessionValue.logout(); history.push('/login'); }}>
                <ListItemIcon><PowerOffIcon /></ListItemIcon>
                <ListItemText primary={'退出登录'} />
              </ListItem>
            )
          }
        })()}
      </List>
    </div>
  );

  return (
    <div>
      {(
        <React.Fragment key={anchor}>
          {NavBar}
          <Fab color="primary" aria-label="drawer" className={classes.fab} onClick={click}>
            <MenuIcon />
          </Fab>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list}
          </Drawer>
        </React.Fragment>
      )}
    </div>
  );
}
