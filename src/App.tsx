import React from "react";
import SignIn from './commonUI/SignIn';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Container } from "@material-ui/core";
import { ThemeProvider } from '@material-ui/core/styles';
import NavDrawer from "./commonUI/NavDrawer";
import { createMuiTheme } from '@material-ui/core/styles';
import { purple } from "@material-ui/core/colors";
import { SessionProvider } from "./session/SessionProvider";
import BBS from "./post/BBS";
import DetailPost from "./post/DetailPost";
import Profile from "./bbs/Profile";
import Favor from "./bbs/Favor";
import Hist from "./bbs/Hist";
import About from "./commonUI/About";

const theme = createMuiTheme({
  palette: {
    primary: purple,
  },
});

interface IProps {
  classes: any
}
interface IState {
  username: string,
  password: string,
  isLogging: boolean,
  isfailed: boolean
}


export default class App extends React.Component {
  render() {
    return (
      <Router>
        <SessionProvider>
          <ThemeProvider theme={theme}>
            <NavDrawer></NavDrawer>
            <Container component="main">
              <Switch>
                <Route exact path="/" render={() => <Redirect to={{
                    pathname: "/login"
                  }}/>}>
                </Route>
                {/* 若已经登陆，直接跳到帖子区。否则进入登录界面。 */}
                <Route path='/login'>
                  <SignIn />
                </Route>
                <Route path='/profile'>
                  <Profile />
                </Route>
                {/* 若未登录，跳到登陆界面。否则进入帖子区。 */}
                <Route exact path='/bbs' >
                  <BBS />
                </Route>
                {/* 若未登录，跳到登陆界面。否则进入帖子区。 */}
                <Route exact path='/bbs/:postId' render={
                  (p) => (
                    <DetailPost postId={p.match.params.postId} />
                  )
                }>
                </Route>
                <Route path='/favor'>
                  <Favor />
                </Route>
                <Route path='/history'>
                  <Hist />
                </Route>
                <Route path='/about'>
                  <About />
                </Route>
              </Switch>
            </Container>
          </ThemeProvider>
        </SessionProvider>
      </Router>
    );
  }
}