import React from 'react';
import { Theme, ListItem, ListItemText, Container, Typography, Link } from '@material-ui/core';
import withStyles, { Styles } from '@material-ui/core/styles/withStyles';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { List } from '@material-ui/core';

const styles: Styles<Theme, {}, string> = (theme: Theme) => ({
  
});

interface IProps extends RouteComponentProps {
  classes?: any
}
interface IState {

}


class About extends React.Component<IProps, IState> {

  componentDidMount() {
  }

  render() {
    return (
      <Container maxWidth='md'>
        <List>
          <ListItem key={'开发者'} button divider>
            <ListItemText>
              <Typography gutterBottom variant="body1" component="p">
                {'开发者: Leonardodalinky'}
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem key={'Github主页'} button divider>
            <ListItemText>
              <Typography gutterBottom variant="body1" component="p">
              {'Github主页: '}
              </Typography>
              <Link variant="body1" href="https://github.com/leonardodalinky">Leonardodalinky</Link>
            </ListItemText>
          </ListItem>
          <ListItem key={'QQ'} button divider>
            <ListItemText>
              <Typography gutterBottom variant="body1" component="p">
              {'QQ: 493987054'}
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem key={'Mail'} button divider>
            <ListItemText>
              <Typography gutterBottom variant="body1" component="p">
              {'Mail: '}
              </Typography>
              <Link variant="body1" href="mailto:493987054@qq.com">QQ邮箱</Link>
              <div />
              <Link variant="body1" href="mailto:link18thu@outlook.com">Outlook邮箱</Link>
            </ListItemText>
          </ListItem>
        </List>
      </Container>

    );
  }
}

export default withStyles(styles)(withRouter(About));