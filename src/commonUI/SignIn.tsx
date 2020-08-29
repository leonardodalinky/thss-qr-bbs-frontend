import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import TwitterIcon from '@material-ui/icons/Twitter';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {SessionConsumer, SessionErrno, SessionContext } from '../session/SessionProvider';
import { red } from '@material-ui/core/colors';
import { Styles } from '@material-ui/core/styles/withStyles';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import MessageBar from './MessageBar';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/leonardodalinky/">
        Linky's Github
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const styles: Styles<Theme, {}, string> = (theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.dark,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  failHint: {
    color: red[500]
  }
});

interface IProps extends RouteComponentProps {
  classes: any
}
interface IState {
  username: string,
  password: string,
  isRemember: boolean,
  isLogging: boolean,
  isfailed: boolean,
  wrongBar: boolean
}


export class SignIn extends React.Component<IProps, IState>{
  static contextType = SessionContext;

  failLoginHint(t: boolean) {
    // TODO
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isRemember: true,
      isLogging: false,
      isfailed: false,
      wrongBar: false
    }
    this.username_onChange = this.username_onChange.bind(this)
    this.pwd_onChange = this.pwd_onChange.bind(this)
  }

  // 账号获取handler
  username_onChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    e.preventDefault();
    this.setState({username: e.target.value});
  }

  // 密码获取handler
  pwd_onChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    e.preventDefault();
    this.setState({password: e.target.value});
  }

  componentDidMount() {
    if (this.context.isLogin || this.context.isLogin_local()) {
      this.props.history.push('/bbs');
    }
  }

  render() {
    const { classes } = this.props;

    const NewButton = () => (
      <SessionConsumer>
        {
          (cont) => (
            <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.preventDefault();
              if (this.state.isLogging) {
                return;
              }
              const username = this.state.username;
              const password = this.state.password;
              this.setState({isLogging: true});
              await cont.login(username, password, this.state.isRemember).then((res) => {
                let isfailed = false;
                if (res[0] !== SessionErrno.SUCCESS) {
                  isfailed = true;
                } else {
                  // 切换网页
                  this.props.history.push('/bbs');
                  console.log('succeed login');
                }
                this.setState({isfailed: isfailed, isLogging: false, wrongBar: isfailed});
              });
            }}
          >
            登录
          </Button>
          )
        }
      </SessionConsumer>
  )

    return (
      <Container component="div" maxWidth="xs">
        <CssBaseline />
        <MessageBar 
        open={this.state.wrongBar} 
        autoHideDuration={5000} 
        variant="filled"
        severity='error'
        onClose={() => {this.setState({wrongBar: false})}}>密码错误</MessageBar>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <TwitterIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            登录界面
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="账号"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={this.username_onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.pwd_onChange}
            />
            {(() => {
              if (this.state.isfailed) {
                return <p className={classes.failHint}>登录失败: 请检查用户名和密码，并确认网络通畅。</p>
              }
            })()}
            <FormControlLabel
              control={
                <Checkbox defaultChecked value="remember" color="primary" onChange={(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                  e.preventDefault();
                  this.setState({isRemember: e.target.checked});
                }}/>
              }
              label="记住我"
            />
            <NewButton />
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }

}

export default withStyles(styles)(withRouter(SignIn));
