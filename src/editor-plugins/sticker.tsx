// React-Editor-Lite 自定义表情插件
import React from 'react'
import { PluginComponent, PluginProps, DropList } from 'react-markdown-editor-lite';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Grid } from '@material-ui/core';

interface IState {
    show: boolean;
  }
  
interface IProps extends PluginProps {
  config: {
    maxRow?: number;
    maxCol?: number;
  };
}

export default class Sticker extends PluginComponent<IState, IProps> {
  // 这里定义插件名称，注意不能重复
  static pluginName = 'sticker';
  // 定义按钮被放置在哪个位置，默认为左侧，还可以放置在右侧（right）
  static align = 'left';
  // 如果需要的话，可以在这里定义默认选项
//   static defaultConfig = {
//     start: 0
//   }
  
  constructor(props: any) {
    super(props);

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    this.state = {
      show: false,
    };
  }

  handleClick(content: string, toEnd: boolean): () => void {
    return () => {
      const now_sel = this.editor.getSelection();
      const offset = (toEnd)? 1 + content.length : 0;
      this.editor.insertText('#(' + content + ')', true, {
          start: now_sel.start + 2 + offset,
          end: now_sel.start + 2 + offset
      });
    }
  }

  private show() {
    this.setState({
      show: true,
    });
  }
  private hide() {
    this.setState({
      show: false,
    });
  }

  render() {
    const nums: number[] = [];
    for (let i = 1;i <= 54;++i) {
      nums.push(i);
    }

    const baseUrl = 'https://cdn.aixifan.com/dotnet/20130418/umeditor/dialogs/emotion/images/ac/';
    const suffixUrl = '.gif?v=0.1';

    return (
      <span
        className="button button-type-counter"
        title="表情"
        // onClick={this.show.bind(this)}
        onMouseEnter={this.show}
        onMouseLeave={this.hide}
      >
        <InsertEmoticonIcon />
        <DropList show={this.state.show} onClose={this.hide}>
          <div style={{minWidth: '300px'}}>
            <Grid container>
              {nums.map((value: number, index: number, array: number[]) => {
                return (
                  <Grid item xs={2} key={index}>
                    <img 
                    src={baseUrl + value + suffixUrl} 
                    alt={'AC娘' + value} 
                    width={50}
                    onClick={this.handleClick(value.toString(), true)}
                    />
                  </Grid>
                )
              })}
            </Grid>
          </div>
        </DropList>
      </span>
    );
  }
}
