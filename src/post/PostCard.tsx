import React from 'react'
import { Card, CardActionArea, CardHeader, Avatar, CardContent, Typography, Theme, CardActions, Button } from '@material-ui/core';
import withStyles, { Styles } from '@material-ui/core/styles/withStyles';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Common from '../common/Common';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ReactMarkdown from 'react-markdown'
import LongPicture from '../md-plugins/LongPicture';
import { isUndefined } from 'util';
import clsx from 'clsx';

// const htmlParser = require('react-markdown/plugins/html-parser');
// const parseHtml = htmlParser({
//   isValidNode: function isValidNode(node: any) {
//     return node.type !== 'script' && node.type !== 'style' &&
//       node.type !== 'img';
//   }
//   // isValidNode: (node: any) => {
//   //   return false;
//   // }
// })

export class Post {
  id = 0;           // 帖子id
  userId = 0;
  nickname = '';
  title = '';       // 帖子标题
  content = '';     // 帖子内容
  lastRepliedUserId = 0;    // 最后一个回复帖子的userId
  lastRepliedNickname = ''; // 最后一个回复帖子的用户绰号
  lastRepliedTime = '';     // 最后一个回复帖子的时间
  created = '';     // 主贴创建时间
  updated = '';     // 主贴更新时间
  constructor(postObj: any) {
    this.id       = postObj['id'];
    this.userId   = postObj['userId'];
    this.nickname = postObj['nickname'];
    this.title    = postObj['title'];
    this.content  = postObj['content'];
    this.lastRepliedUserId    = postObj['lastRepliedUserId'];
    this.lastRepliedNickname  = postObj['lastRepliedNickname'];
    this.lastRepliedTime      = postObj['lastRepliedTime'];
    this.created  = postObj['created'];
    this.updated  = postObj['updated'];
  }
}

const styles: Styles<Theme, {}, string> = (theme: Theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.dark,
  },
  card: {
    margin: theme.spacing(1),
  },
  maxTextWidth: {
    maxWidth: '200px'
  },
  sec: {
    flex: 1,
    minHeight: 0,
    minWidth: 0
  },
  htmlWrap: {
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'auto'
  },
  sectionContainer: {
    padding: '15px',
    paddingTop: '10px'
  }
});

export interface IProps extends RouteComponentProps {
  post: Post,
  classes?: any,
  onClick?: any,
  showLongText?: boolean
}
interface IState {
  favored: boolean
}

class PostCard extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      favored: Common.hasFavor(props.post?.id!),
    };
  }

  /**
   * 剪短一个文本，并加省略号
   * @date 2020-08-28
   * @param {any} text:string
   * @returns {any}
   */
  static textCutShort(text: string, isfunction?: boolean) {
    if (!isUndefined(isfunction) && isfunction && text.length > 300) {
      return text.slice(0, 300) + '  ... ...'
    } else {
      return text;
    }
  }

  componentDidMount() {
  }

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card} onClick={this.props.onClick}>
        <CardActionArea onClick={() => {
          this.props.history.push('/bbs/' + this.props.post?.id);
        }}>
          <CardHeader
          avatar={
            <Avatar aria-label="post-avatar" className={classes.avatar}>
              {this.props.post!.nickname[0]}
            </Avatar>
          }
          title={this.props.post!.nickname}
          subheader={
            <div>
              <Typography gutterBottom variant="caption" component="p">
                {'最后编辑时间: ' + this.props.post!.updated}
              </Typography>
              <Typography gutterBottom variant="caption" component="p">
                {'最后回复时间: ' + this.props.post!.lastRepliedTime}
              </Typography>
              <Typography gutterBottom variant="caption" component="p">
                {'帖子ID: ' + this.props.post?.id}
              </Typography>
            </div>
          }
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {this.props.post!.title}
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              <section>
                <div className={clsx(classes.htmlWrap, classes.sectionContainer)}>
                  <ReactMarkdown 
                  source={Common.stickerWrapper(PostCard.textCutShort(this.props.post.content, this.props.showLongText))} 
                  renderers={{'image': LongPicture}}
                  // escapeHtml={false}
                  // astPlugins={[parseHtml]}
                  />
                </div>
              </section>
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {/* 收藏按钮 */}
          {(() => {
            if (this.state.favored) {
              return (
                <Button 
                size="small" 
                color="primary" 
                startIcon={<FavoriteIcon />}
                onClick={() => {
                  Common.unfavor(this.props.post?.id!);
                  this.setState({favored: false});
                }}
                >
                  取消收藏
                </Button>);
            } else {
              return (
                <Button 
                size="small" 
                color="primary" 
                startIcon={<FavoriteBorderIcon />}
                onClick={() => {
                  Common.favor(this.props.post?.id!);
                  this.setState({favored: true});
                }}
                >
                  收藏此贴
                </Button>);
            }
          })()}
          {/* 上层传递的ActionButton */}
          {this.props.children}
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(withRouter(PostCard));