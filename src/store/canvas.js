import { getOnlyKey } from "../utils";

const defaultCanvas = {
  style: {
    width: 320,
    height: 568,
    backgroundColor: "#ffffff00",
    backgroundImage: "",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    boxSizing: "content-box",
  },
  cmps: [],
  // cmps: [
  //   {
  //     key: getOnlyKey(),
  //     desc: "文本",
  //     value: "文本",
  //     style: {
  //       position: "absolute",
  //       top: 0,
  //       left: 0,
  //       width: 100,
  //       height: 30,
  //       fontSize: 12,
  //       color: "red",
  //     },
  //   },
  // ],
};

export default class Canvas {
  constructor(_canvas = defaultCanvas) {
    this.canvas = _canvas; // 页面数据
    // 被选中组件的下标
    this.selectedCmpIndex = null;
    this.listeners = [];
  }

  // get
  getCanvas = () => {
    return {
      ...this.canvas,
    };
  };

  getCanvasCmps = () => {
    return [...this.canvas.cmps];
  };

  getSelectedCmp = () => {
    const cmps = this.getCanvasCmps();
    return cmps[this.selectedCmpIndex];
  };

  getSelectedCmpIndex = () => {
    return this.selectedCmpIndex;
  };

  setSelectedCmpIndex = (index) => {
    if (this.selectedCmpIndex == index) {
      return;
    }
    this.selectedCmpIndex = index;
    this.updateApp();
  };

  // set
  setCanvas = (_canvas) => {
    Object.assign(this.canvas, _canvas);
  };

  // 新增组件
  addCmp = (_cmp) => {
    // 1.更新画布数据
    const cmp = { key: getOnlyKey(), ..._cmp };
    this.canvas.cmps.push(cmp);
    // 2.新增的组件设置为选中
    this.setSelectedCmpIndex(this.canvas.cmps.length - 1);
    // 3.更新组件
    this.updateApp();
  };

  updateCanvasStyle = (newStyle) => {
    this.canvas.style = {
      ...this.canvas.style,
      ...newStyle,
    };
    this.updateApp();
  };

  updateApp = () => {
    // 希望组件更新
    this.listeners.forEach((lis) => lis());
  };

  subscribe = (listener) => {
    this.listeners.push(listener);
    // 取消订阅
    return () => {
      this.listeners = this.listeners.filter((lis) => lis != listener);
    };
  };

  updateSelectedCmp = (newStyle = {}, newValue) => {
    const selectedCmp = this.getSelectedCmp();
    Object.assign(this.canvas.cmps[this.getSelectedCmpIndex()], {
      style: { ...selectedCmp.style, ...newStyle },
      // TODO: 编辑模版
      // value:
    });
    this.updateApp();
  };

  getPublicCanvas = () => {
    const obj = {
      getCanvas: this.getCanvas,
      getCanvasCmps: this.getCanvasCmps,
      addCmp: this.addCmp,
      subscribe: this.subscribe,
      setSelectedCmpIndex: this.setSelectedCmpIndex,
      updateSelectedCmp: this.updateSelectedCmp,
      updateCanvasStyle: this.updateCanvasStyle,
      getSelectedCmp: this.getSelectedCmp,
      getSelectedCmpIndex: this.getSelectedCmpIndex,
    };
    return obj;
  };
}
