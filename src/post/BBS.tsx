import React from 'react'
import { Container, Typography, Button, Snackbar, Input, Theme, Box, Switch, FormControlLabel } from '@material-ui/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Post, IProps as IProps_Post} from './PostCard';
import PostCard from './PostCard';
import { SessionContext, SessionErrno } from '../session/SessionProvider';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Slider from '@material-ui/core/Slider';
import RefreshIcon from '@material-ui/icons/Refresh';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import withStyles, { Styles } from '@material-ui/core/styles/withStyles';
import { purple } from '@material-ui/core/colors';
import Editor from './Editor';
import Pagination from '@material-ui/lab/Pagination';
import MessageBar from '../commonUI/MessageBar';

const styles: Styles<Theme, {}, string> = (theme: Theme) => ({
  slider_root: {
    width: '150px',
    margin: '5px'
  },
  input_root: {
    maxWidth: '100px',
  },
  box_compo: {
    margin: '5px',
    minWidth: '100px'
  }
});

interface IProps extends RouteComponentProps {
  classes?: any
}
interface IState {
  size: number,       // 每一页的帖子数量
  total: number,      // 总共有几页
  page: number,       // 目前为第几页
  userId?: number,     // 指定查询某人的帖子
  posts: Post[],
  // 消息条
  previousSnackBarOpen: boolean,
  nextSnackBarOpen: boolean,
  userIdToFind?: number,
  // 是否发帖中
  isCreating: boolean,
  wrongBar: boolean,
  orderByRep: boolean
}

class BBS extends React.Component<IProps, IState> {
  static contextType = SessionContext;

  constructor(props: IProps) {
    super(props);
    this.state = {
      size: 10,
      total: 1,
      page: 1,
      userId: undefined,
      posts: [],
      previousSnackBarOpen: false,
      nextSnackBarOpen: false,
      userIdToFind: undefined,
      isCreating: false,
      wrongBar: false,
      orderByRep: true
    }
  }

  SizeSlider() {
    const { classes } = this.props;

    return (
      <div className={classes.slider_root}>
        <Typography id="discrete-slider" gutterBottom variant='body2'>
          每页帖子数量
        </Typography>
        <Slider
          defaultValue={this.state.size}
          getAriaValueText={(value: number, index: number): string => { return value.toString() }}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          marks
          min={5}
          max={100}
          onChange={(e:any, value: number | number[]) => {
            this.setState({size: value as number}, () => {this.updatePosts()});
          }}
        />
      </div>
    )
  }

  UserIDInput() {
    const { classes } = this.props;

    return (
      <div className={classes.box_compo}>
        <Typography id="discrete-slider" gutterBottom variant='body2'>
          特定用户ID
        </Typography>
        <Input
        className={classes.input_root}
        margin="dense"
        onKeyPress={(event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter") {
            this.setState({userId: this.state.userIdToFind, page: 1}, () => {this.updatePosts()});
          }
          
        }}
        onChange={(e: any) => {
          const v = (e.target.value === '' || e.target.value === undefined)? undefined : e.target.value as number;
          this.setState({userIdToFind: v});
        }}
        inputProps={{
          min: 0,
          type: 'number',
          style: { textAlign: 'right' }
        }}
        />
      </div>

    )
  }

  async updatePosts() {
    const sessionValue = this.context;
    const page_local = localStorage.getItem('bbs_page');
    const size_local = localStorage.getItem('bbs_size');
    localStorage.removeItem('bbs_page');
    localStorage.removeItem('bbs_size');
    const posts: [number, any] | any[] = await sessionValue.get_post({
      page: (page_local === null)? this.state.page : Number(page_local).valueOf(),
      size: (size_local === null)? this.state.size : Number(size_local).valueOf(),
      userId: this.state.userId,
      orderByReply: this.state.orderByRep
    });
    const ret_num: number = posts[0];
    const ret_obj: any = posts[1];
    if (ret_num === SessionErrno.ERR_NOT_LOGIN) {
      this.props.history.push('/login');
    } else if (ret_num !== SessionErrno.SUCCESS) {
      // 刷新帖子失败的反馈
      this.setState({wrongBar: true});
    } 
    else {
      const new_posts: Post[] = [];
      for (let i = 0;i < ret_obj['posts'].length; ++i) {
        new_posts.push(new Post(ret_obj['posts'][i]));
      }
      this.setState({
        page: (page_local === null)? ret_obj['page'] : Number(page_local).valueOf(),
        total: ret_obj['total'],
        size: (size_local === null)? ret_obj['size'] : Number(size_local).valueOf(),
        posts: new_posts
      })
    }
  }

  createPost() {
    this.setState({isCreating: true});
  }

  componentDidMount() {
    this.context.untilInited().then(this.updatePosts.bind(this)).catch(() => {this.props.history.push('/login')});;
  }


  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        {/* 错误提示 */}
        <MessageBar 
        open={this.state.wrongBar} 
        autoHideDuration={5000} 
        variant="filled"
        severity='error'
        onClose={() => {this.setState({wrongBar: false})}}>未知错误</MessageBar>
        <Container maxWidth='md'>
          <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          border={1}
          borderColor={purple[200]}
          boxShadow={2}
          flexWrap='wrap'
          m={2}
          >
            <Button variant="outlined" color="primary" startIcon={<RefreshIcon />}
            onClick={() => { this.updatePosts(); }} className={classes.box_compo}
            >
              刷新
            </Button>
            <Button variant="outlined" color="primary" startIcon={<ArrowForwardIcon />}
            onClick={this.createPost.bind(this)} className={classes.box_compo}
            >
              发帖
            </Button>
            {this.SizeSlider()}
            {this.UserIDInput()}
            <FormControlLabel
            control={
              <Switch
              checked={this.state.orderByRep}
              defaultChecked={true}
              onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                this.setState({orderByRep: checked}, this.updatePosts.bind(this));
              }}
              name="orderByReply"
              color="primary"
            />
        }
        label="按回复时间排序"
      />
          </Box>
        </Container>
        {(() => {
          if (this.state.isCreating) {
            return (
              <Container maxWidth='lg'>
                <Editor 
                type='reply'
                action='create'
                nickname={'无'}
                pid={0}
                uid={0}
                onCloseButton={() => { this.setState({isCreating: false}); }}
                />
              </Container>
            )
          }
        })()}
        <Container maxWidth='md'>
          {
            this.state.posts.map((value: Post, index: number, array: Post[]) => {
              return (
                <PostCard post={value} {...this.props} 
                showLongText={true}
                onClick={() => {
                  // 储存页面位置
                  localStorage.setItem('bbs_page', this.state.page.toString());
                  localStorage.setItem('bbs_size', this.state.size.toString());
                }}/>
              );
            })
          }
        </Container>
        {/* 底部转页 */}
        <Container maxWidth='md'>
          <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap='wrap'
          m={2}
          >
            <Pagination 
            count={Math.ceil(this.state.total / this.state.size)} 
            showFirstButton 
            showLastButton 
            onChange={(event: React.ChangeEvent<unknown>, page: number) => {
              this.setState({page}, () => {this.updatePosts()});
            }} 
            page={this.state.page}
            variant="text" 
            color="primary"
            />
          </Box>
        </Container>
        {/* 通知消息条 */}
        <Snackbar
        open={this.state.previousSnackBarOpen}
        onClose={() => {
          this.setState({previousSnackBarOpen: false});
        }}
        message='已经到第一页啦~'
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
        <Snackbar
        open={this.state.nextSnackBarOpen}
        onClose={() => {
          this.setState({nextSnackBarOpen: false});
        }}
        message='已经到最后一页啦~'
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(withRouter(BBS));