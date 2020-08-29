export default class Common {
  /**
   * 判断是否收藏帖子
   * @date 2020-08-26
   * @param {any} postId:number
   * @returns {any}
   */
  static hasFavor(postId: number): boolean {
    const s = localStorage.getItem('favor');
    if (s === null || s === '') {
      return false;
    }
    const ss = s.split(',');
    for (let i = 0;i < ss.length;++i){
      // eslint-disable-next-line
      if (ss[i] !== '' && Number(ss[i]).valueOf() == postId) {
        return true;
      }
    }
    return false;
  }
  /**
   * 收藏帖子
   * @date 2020-08-26
   * @param {any} postId:number
   * @returns {any}
   */
  static favor(postId: number): void {
    if (Common.hasFavor(postId)) {
      return;
    }
    const s = localStorage.getItem('favor');
    if (s === '' || s === null) {
      localStorage.setItem('favor', postId.toString());
    } else {
      const s2 = s + ',' + postId;
      localStorage.setItem('favor', s2);
    }

  }
  /**
   * 取消收藏帖子
   * @date 2020-08-26
   * @param {any} postId:number
   * @returns {any}
   */
  static unfavor(postId: number): void {
    if (!Common.hasFavor(postId)) {
      return;
    }
    const s = localStorage.getItem('favor');
    const ss = s!.split(',');
    const index = ss.indexOf(postId.toString());
    ss.splice(index);
    const after_s = ss.join(',');
    localStorage.setItem('favor', after_s);
  }
  /**
   * 返回收藏列表
   * @date 2020-08-27
   * @returns {any}
   */
  static showFavor(): number[] {
    const s = localStorage.getItem('favor');
    if (s === null || s === '') {
      return [];
    }
    const ss = s.split(',');
    return ss.map((value: string, index: number, array: string[]) => {
      return Number(value).valueOf();
    })
  }
  /**
   * 记录看过的帖子
   * @date 2020-08-26
   * @param {any} postId:number
   * @returns {any}
   */
  static record(postId: number): void {
    const s = localStorage.getItem('rc');
    if (s === null || s === '') {
      localStorage.setItem('rc', postId.toString());
    } else {
      const ss = s + ',' + postId.toString();
      localStorage.setItem('rc', ss);
    }
  }
  /**
   * 返回浏览记录
   * @date 2020-08-26
   * @returns {any}
   */
  static showRecord(): number[] {
    const s = localStorage.getItem('rc');
    if (s === null || s === '') {
      return [];
    } else {
      const ss = s.split(',');
      return ss.map((value: string, index: number, array: string[]) => {
        return Number(value).valueOf();
      })
    }
  }
  static clearRecord(): void {
    localStorage.removeItem('rc');
  }
  static stickerWrapper(text: string): string {
    const reg = new RegExp("#\\((\\d+)\\)","gmi");
    return text.replace(reg, '![AC$1](https://cdn.aixifan.com/dotnet/20130418/umeditor/dialogs/emotion/images/ac/$1.gif?v=0.1)');
  }
}