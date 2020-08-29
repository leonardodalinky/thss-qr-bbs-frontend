import React, { useRef } from 'react';
// import { Theme, ListItem, ListItemText, Container, Typography, Link } from '@material-ui/core';
// import withStyles, { Styles } from '@material-ui/core/styles/withStyles';
// import { withRouter, RouteComponentProps } from 'react-router-dom';
// import { isUndefined } from 'util';
// import Zmage from 'react-zmage';

// const styles: Styles<Theme, {}, string> = (theme: Theme) => ({
  
// });

interface IProps {
  alt?: string,
  title?: string,
  src: string
}
interface IState {

}

const MAX_HEIGHT = 300;
const MAX_WIDTH = 300;

function smallen(imgRef: any) {
  imgRef.current.height = imgRef.current.naturalHeight;
  imgRef.current.width = imgRef.current.naturalWidth;
  if (imgRef.current.height > MAX_HEIGHT) {
    const odd = MAX_HEIGHT / imgRef.current.height;
    imgRef.current.height *= odd;
    imgRef.current.width *= odd;
  } 
  if (imgRef.current.width > MAX_WIDTH) {
    const odd = MAX_WIDTH / imgRef.current.width;
    imgRef.current.height *= odd;
    imgRef.current.width *= odd;
  }
}
function original(imgRef: any) {
  imgRef.current.height = imgRef.current.naturalHeight;
  imgRef.current.width = imgRef.current.naturalWidth;
}

function LongPicture(this: any, props: any) {
  // const { src, title, alt } = props;

  const imgRef: any = useRef(null);

  let isSmall = false;

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img {...props} 
    onClick={(event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      // Zmage.browsing({
      //   src,
      //   alt,
      //   zIndex: 1919810,
      //   controller:{
      //     // 关闭按钮
      //     close: true,
      //     // 缩放按钮
      //     zoom: true,
      //     // 下载按钮
      //     download: true,
      //     // 旋转按钮
      //     rotate: true,
      //     // 翻页按钮
      //     flip: true,
      //     // 多页指示
      //     pagination: true,
      //   }
      // })
      if (isSmall) {
        original(imgRef);
        isSmall = false;
      } else {
        smallen(imgRef);
        isSmall = true;
      }
    }}
    ref={imgRef}
    onLoad={() => {
      isSmall = true;
      smallen(imgRef);
    }}
    />
  );
}

export default LongPicture;