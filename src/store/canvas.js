import { cloneDeep } from "lodash";
import { getOnlyKey } from "../utils";

function getDefaultCanvas() {
  return {
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
  };
}

export default class Canvas {
  constructor(_canvas = getDefaultCanvas()) {
    this.canvas = _canvas; // 页面数据
    // 选中组件的下标集合
    this.assembly = new Set();

    this.listeners = [];
    // 画布历史初始值
    this.canvasChangeHistory = [JSON.stringify(this.canvas)];
    // 方便进行前进和后退
    this.canvasChangeHistoryIndex = 0;

    // 最大记录100条数据
    this.maxCanvasChangeHistory = 100;
  }

  // 历史记录
  recordCanvasChangeHistory = () => {
    this.canvasChangeHistory[++this.canvasChangeHistoryIndex] = JSON.stringify(
      this.canvas
    );
    this.canvasChangeHistory = this.canvasChangeHistory.slice(
      0,
      this.canvasChangeHistoryIndex + 1
    );

    // 最多记录100条
    if (this.canvasChangeHistory.length > this.maxCanvasChangeHistory) {
      this.canvasChangeHistory.shift();
      this.canvasChangeHistoryIndex--;
    }
  };

  goPrevCanvasHistory = () => {
    let newIndex = this.canvasChangeHistoryIndex - 1;
    if (newIndex < 0) {
      newIndex = 0;
    }
    console.log("prev:", this.canvasChangeHistory);
    console.log("prevIndex:", newIndex);
    if (this.canvasChangeHistoryIndex === newIndex) {
      return;
    }
    this.canvasChangeHistoryIndex = newIndex;
    const newCanvas = JSON.parse(this.canvasChangeHistory[newIndex]);
    this.canvas = newCanvas;
    this.updateApp();
  };

  goNextCanvasHistory = () => {
    let newIndex = this.canvasChangeHistoryIndex + 1;
    if (newIndex >= this.canvasChangeHistory.length) {
      newIndex = this.canvasChangeHistory.length - 1;
    }

    console.log("next:", this.canvasChangeHistory);
    console.log("nextIndex:", newIndex);
    if (this.canvasChangeHistoryIndex === newIndex) {
      return;
    }
    this.canvasChangeHistoryIndex = newIndex;
    const newCanvas = JSON.parse(this.canvasChangeHistory[newIndex]);
    this.canvas = newCanvas;
    this.updateApp();
  };

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
    return cmps[this.getSelectedCmpIndex()];
  };

  getSelectedCmpIndex = () => {
    const selectedCmpIndex = Array.from(this.assembly)[0];
    return selectedCmpIndex === undefined ? -1 : selectedCmpIndex;
  };

  setSelectedCmpIndex = (index) => {
    if (this.getSelectedCmpIndex() === index) {
      return;
    }
    // this.selectedCmpIndex = index;
    this.assembly.clear();

    if (index > -1) {
      this.addToAssembly(index);
      // this.assembly.add(index)
    }

    this.updateApp();
  };

  // set
  setCanvas = (_canvas) => {
    if (_canvas) {
      Object.assign(this.canvas, _canvas);
    } else {
      this.canvas = getDefaultCanvas();
    }
    this.updateApp();
    // 记录历史记录
    this.recordCanvasChangeHistory();
  };

  // 新增组件
  addCmp = (_cmp) => {
    // 1.更新画布数据
    const cmp = { ..._cmp, key: getOnlyKey() };
    this.canvas.cmps.push(cmp);
    // 2.新增的组件设置为选中
    // this.setSelectedCmpIndex(this.canvas.cmps.length - 1);
    this.assembly.clear();
    this.addToAssembly(this.canvas.cmps.length - 1);
    // 3.更新组件
    this.updateApp();
    // 记录历史记录
    this.recordCanvasChangeHistory();
  };

  updateCanvasStyle = (newStyle) => {
    this.canvas.style = {
      ...this.canvas.style,
      ...newStyle,
    };
    this.updateApp();
    // 记录历史记录
    this.recordCanvasChangeHistory();
  };

  updateApp = () => {
    // 希望组件更新
    this.listeners.forEach((lis) => lis());
  };

  subscribe = (listener) => {
    this.listeners.push(listener);
    // 取消订阅
    return () => {
      this.listeners = this.listeners.filter((lis) => lis !== listener);
    };
  };

  updateSelectedCmp = (newStyle, newValue) => {
    const selectedCmp = this.getSelectedCmp();

    if (newStyle) {
      this.canvas.cmps[this.getSelectedCmpIndex()].style = {
        ...selectedCmp.style,
        ...newStyle,
      };
    }

    if (newValue != undefined) {
      this.canvas.cmps[this.getSelectedCmpIndex()].value = newValue;
    }

    this.updateApp();
  };

  // 删除组件
  deleteCmps = () => {
    const sorted = Array.from(this.assembly).sort((a, b) => b - a);
    sorted.forEach((index) => {
      this.canvas.cmps.splice(index, 1);
    });
    this.assembly.clear();
    this.updateApp();
    this.recordCanvasChangeHistory();
  };

  // 上移
  addCmpIndex = (cmpIndex = this.getSelectedCmpIndex()) => {
    const cmps = this.getCanvasCmps();
    // 已经在最顶层，直接退出操作
    const targetIndex = cmpIndex + 1;
    if (targetIndex >= cmps.length) {
      return;
    }

    const temp = cmps[cmpIndex];
    this.canvas.cmps[cmpIndex] = this.canvas.cmps[targetIndex];
    this.canvas.cmps[targetIndex] = temp;

    this.setSelectedCmpIndex(targetIndex);

    this.updateApp();
    this.recordCanvasChangeHistory();
  };

  // 下移
  subCmpIndex = (cmpIndex = this.getSelectedCmpIndex()) => {
    const cmps = this.getCanvasCmps();
    // 已经在最顶层，直接退出操作
    const targetIndex = cmpIndex - 1;
    if (targetIndex < 0) {
      return;
    }

    const temp = cmps[cmpIndex];
    this.canvas.cmps[cmpIndex] = this.canvas.cmps[targetIndex];
    this.canvas.cmps[targetIndex] = temp;

    this.setSelectedCmpIndex(targetIndex);
    this.updateApp();
    this.recordCanvasChangeHistory();
  };

  // 置顶
  topZIndex = (cmpIndex = this.getSelectedCmpIndex()) => {
    const cmps = this.getCanvasCmps();
    // 已经在最顶层，直接退出操作
    if (cmpIndex >= cmps.length - 1) {
      return;
    }

    this.canvas.cmps = cmps
      .slice(0, cmpIndex)
      .concat(cmps.slice(cmpIndex + 1))
      .concat(cmps[cmpIndex]);

    this.setSelectedCmpIndex(cmps.length - 1);
    this.updateApp();
    this.recordCanvasChangeHistory();
  };

  // 置底
  bottomZIndex = (cmpIndex = this.getSelectedCmpIndex()) => {
    const cmps = this.getCanvasCmps();
    // 已经在最顶层，直接退出操作
    if (cmpIndex <= 0) {
      return;
    }

    this.canvas.cmps = [cmps[cmpIndex]]
      .concat(cmps.slice(0, cmpIndex))
      .concat(cmps.slice(cmpIndex + 1));

    this.setSelectedCmpIndex(0);

    this.updateApp();
    this.recordCanvasChangeHistory();
  };

  // 组件
  addToAssembly = (indexes) => {
    if (Array.isArray(indexes)) {
      indexes.forEach((index) => index !== -1 && this.assembly.add(index));
    } else {
      indexes !== -1 && this.assembly.add(indexes);
    }
    console.log("addToAssembly:", this.assembly);
  };

  // 批量操作组件
  addAndUpdateAssembly = (indexes) => {
    this.addToAssembly(indexes);
    this.updateApp();
  };

  // 判断下标为 index 的组件是否被批量选中
  belongingToAssembly = (index) => {
    return this.assembly.has(index);
  };

  // newStyle 里面是移动的差值
  updateAssemblyCmps = (newStyle) => {
    this.assembly.forEach((index) => {
      const cmp = this.canvas.cmps[index];
      console.log("newStyle:", newStyle);
      for (const key in newStyle) {
        console.log(
          "call:",
          key,
          cmp.style[key],
          newStyle[key] - 0,
          typeof cmp.style[key]
        );
        console.log("call2:", cmp.style[key]);
        cmp.style[key] = cmp.style[key] - 0 + newStyle[key] - 0;
        console.log("call3:", cmp.style[key]);
        if (cmp.style.width < 10) {
          cmp.style.width = 10;
        }
        if (cmp.style.height < 10) {
          cmp.style.height = 10;
        }
      }
    });
    this.updateApp();
  };

  // 批量添加组件
  addAssemblyCmps = () => {
    this.assembly.forEach((index) => {
      const cmp = this.canvas.cmps[index];
      const newCmp = cloneDeep(cmp);
      newCmp.key = getOnlyKey();

      newCmp.style.top += 40;
      newCmp.style.left += 40;

      this.canvas.cmps.push(newCmp);
    });
    const cmpsLength = this.canvas.cmps.length;
    const assemblySize = this.assembly.size;

    // 添加组件之后，更新
    this.assembly.clear();
    for (let i = cmpsLength - assemblySize; i < cmpsLength; i++) {
      this.assembly.add(i);
    }
    this.updateApp();
    this.recordCanvasChangeHistory();
  };

  // 判断有没有组件组合

  hasAssembly = () => {
    return this.assembly.size > 1;
  };

  getPublicCanvas = () => {
    const obj = {
      getCanvas: this.getCanvas,
      setCanvas: this.setCanvas,
      getCanvasCmps: this.getCanvasCmps,
      addCmp: this.addCmp,
      deleteCmps: this.deleteCmps,
      subscribe: this.subscribe,
      setSelectedCmpIndex: this.setSelectedCmpIndex,
      updateSelectedCmp: this.updateSelectedCmp,
      updateCanvasStyle: this.updateCanvasStyle,
      getSelectedCmp: this.getSelectedCmp,
      getSelectedCmpIndex: this.getSelectedCmpIndex,
      recordCanvasChangeHistory: this.recordCanvasChangeHistory,
      goPrevCanvasHistory: this.goPrevCanvasHistory,
      goNextCanvasHistory: this.goNextCanvasHistory,
      // 修改层级
      subCmpIndex: this.subCmpIndex,
      addCmpIndex: this.addCmpIndex,
      topZIndex: this.topZIndex,
      bottomZIndex: this.bottomZIndex,
      // 批量操作
      addAndUpdateAssembly: this.addAndUpdateAssembly,
      belongingToAssembly: this.belongingToAssembly,
      updateAssemblyCmps: this.updateAssemblyCmps,
      addAssemblyCmps: this.addAssemblyCmps,
      hasAssembly: this.hasAssembly,
    };
    return obj;
  };
}
