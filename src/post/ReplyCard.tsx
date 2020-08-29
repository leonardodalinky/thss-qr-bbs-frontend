import React from "react";
import { Card, CardActionArea, CardHeader, Avatar, CardContent, Typography, withStyles, Theme, Button, CardActions, Container } from "@material-ui/core";
import { Styles } from "@material-ui/core/styles/withStyles";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReplyIcon from '@material-ui/icons/Reply';
import EditIcon from '@material-ui/icons/Edit';
import { grey } from "@material-ui/core/colors";
import ReactMarkdown from "react-markdown";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Editor from "./Editor";
import { SessionContext } from "../session/SessionProvider";
import LongPicture from "../md-plugins/LongPicture";
import Common from "../common/Common";
import clsx from 'clsx';

// const htmlParser = require('react-markdown/plugins/html-parser');
// const parseHtml = htmlParser({
//   isValidNode: function isValidNode(node: any) {
//     return node.type !== 'script' && node.type !== 'style' &&
//       node.type !== 'img';
//   }
// })

export class Reply {
    id = 0;
    userId = 0;
    nickname = '';
    postId = 0;
    replyId = 0;
    content = '';
    created = '';
    updated = '';
    constructor(replyObj: any) {
      this.id        = replyObj['id'];
      this.userId    = replyObj['userId'];
      this.nickname  = replyObj['nickname'];
      this.postId    = replyObj['postId'];
      this.replyId   = replyObj['replyId'];
      this.content   = replyObj['content'];
      this.created   = replyObj['created'];
      this.updated   = replyObj['updated'];
    }
}

const styles: Styles<Theme, {}, string> = (theme: Theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.dark,
  },
  card: {
    margin: '4px'
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

const card_grey = [
  '#ffffff',
  grey[100],
  grey[300],
  grey[500],
  grey[700],
]

interface IProps extends RouteComponentProps {
  classes?: any,
  replys: Reply[],
  rid: number,
  level: number   // 回复的层级，最顶层为0级，最多为5级
}
interface IState {
  nowReply?: Reply,
  showReplys: boolean,
  replyss: Reply[],     // 回复的回复
  isReplying: boolean,
  isModifying: boolean
}

export class _ReplyCard extends React.Component<IProps, IState> {
  static contextType = SessionContext;

  constructor(props: IProps) {
    super(props);

    this.state = {
      nowReply: _ReplyCard.findReply(this.props.replys, this.props.rid),
      showReplys: false,
      replyss: _ReplyCard.findReplyss(this.props.replys, this.props.rid),
      isReplying: false,
      isModifying: false
    }
  }

  static findReply(replys: Reply[], id: number): Reply | undefined {
    if (replys.length === 0) {
      return undefined;
    }
    for (let i = 0;i < replys.length;++i) {
      if (replys[i].id === id) {
        return replys[i];
      }
    }
    return undefined;
  }

  static findReplyss(replys: Reply[], id: number): Reply[] {
    const ret: Reply[] = [];
    for (let i = 0;i < replys.length;++i) {
      if (replys[i].replyId === id) {
        ret.push(replys[i]);
      }
    }
    return ret;
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Card className={classes.card} variant="outlined" style={{backgroundColor: card_grey[Math.min(4, this.props.level)]}}>
          <CardActionArea>
            <CardHeader
            avatar={
              <Avatar aria-label="post-avatar" className={classes.avatar}>
                {this.state.nowReply?.nickname[0]}
              </Avatar>
            }
            title={this.state.nowReply?.nickname}
            // subheader={'最后回复时间: ' + this.props.reply!.updated}
            subheader={
              <div>
                <Typography gutterBottom variant="caption" component="p">
                  {'最后回复时间: ' + this.state.nowReply?.updated}
                </Typography>
                <Typography gutterBottom variant="caption" component="p">
                  {'回复ID: ' + this.state.nowReply?.id}
                </Typography>
                <Typography gutterBottom variant="caption" component="p">
                  {'被回复ID: ' + this.state.nowReply?.replyId}
                </Typography>
              </div>
            }
            />
            <CardContent>
              <Typography variant="body2" component="p" gutterBottom>
              <section>
                <div className={clsx(classes.htmlWrap, classes.sectionContainer)}>
                  <ReactMarkdown 
                  source={Common.stickerWrapper(this.state.nowReply?.content!)} 
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
            {/* 回复按钮 */}
            <Button 
            size="small" 
            color="primary" 
            startIcon={<ReplyIcon />}
            onClick={() => {
              this.setState({isReplying: true, isModifying: false});
            }}
            >
              回复
            </Button>
            {/* 展开回复按钮 */}
            {(() => {
              if (this.state.replyss.length === 0) {
                return;
              }
              if (this.state.showReplys) {
                return (
                  <Button 
                  size="small" 
                  color="primary" 
                  startIcon={<ExpandLessIcon />}
                  onClick={() => {
                    this.setState({showReplys: false});
                  }}
                  >
                    折叠{this.state.replyss.length}项回复
                  </Button>
                );
              } else {
                return (
                  <Button 
                  size="small" 
                  color="primary" 
                  startIcon={<ExpandMoreIcon />}
                  onClick={() => {
                    this.setState({showReplys: true});
                  }}
                  >
                    展开{this.state.replyss.length}项回复
                  </Button>
                );
              }
            })()}
            {/* 编辑回复按钮 */}
            {(() => {
              const re = _ReplyCard.findReply(this.props.replys, this.props.rid);
              const sessionValue = this.context;
              if (re?.userId === sessionValue.userId) {
                return (
                  <Button 
                  size="small" 
                  color="primary" 
                  startIcon={<EditIcon />}
                  onClick={() => {
                    this.setState({isReplying: false, isModifying: true});
                  }}
                  >
                    编辑回复
                  </Button>
                )
              }
            })()}
          </CardActions>
        </Card>
        {/* 回复/编辑栏 */}
        {(() => {
          if (this.state.isReplying) {
            const re = _ReplyCard.findReply(this.props.replys, this.props.rid);
            return (
              <Container maxWidth='lg'>
                <Editor 
                type='reply'
                action='add'
                nickname={re!.nickname}
                pid={re!.postId}
                uid={re!.userId}
                rid={this.props.rid}
                onCloseButton={() => { this.setState({isReplying: false, isModifying: false}); }}
                />
              </Container>
            )
          } else if (this.state.isModifying) {
            const re = _ReplyCard.findReply(this.props.replys, this.props.rid);
            return (
              <Container maxWidth='lg'>
                <Editor 
                type='reply'
                action='modify'
                nickname={re!.nickname}
                pid={re!.postId}
                uid={re!.userId}
                rid={this.props.rid}
                defaultContent={re?.content}
                onCloseButton={() => { this.setState({isReplying: false, isModifying: false}); }}
                />
              </Container>
            )
          }
        })()}
        {/* 展开的回复 */}
        {(() => {
          if (this.state.showReplys && this.state.replyss.length > 0) {
            return this.state.replyss.map((value: Reply, index: number, array: Reply[]) => {
              return (
                <ReplyCard 
                replys={this.props.replys} 
                level={this.props.level + 1}
                rid={value.id}
                >
                </ReplyCard>
              )
            })
          }
        })()}
      </React.Fragment>
    );
  }
}

const ReplyCard = withStyles(styles)(withRouter(_ReplyCard));

export default ReplyCard;