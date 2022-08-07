import styles from "./index.less";
import classNames from "classnames";
import { Component } from "react";
import { CanvasContext } from "../../context";
import { isImgComponent, isTextComponent } from "../../layout/Left";
import Img from "../Img";
import Text from "../Text";

// TODO: 拖拽，删除，改变层级关系
export default class Cmp extends Component {
  static contextType = CanvasContext;

  // onDragStart = (e) => {
  //   this.setSelected(e);
  //   // 拖拽的开始位置
  //   const startX = e.pageX;
  //   const startY = e.pageY;

  //   e.dataTransfer.setData("text", startX + "," + startY);
  // };

  onMouseDownOfCmp = (e) => {
    // 关闭，否则会触发其他组件的选中行为
    e.preventDefault();

    let startX = e.pageX;
    let startY = e.pageY;

    const { cmp, zoom } = this.props;
    const move = (e) => {
      const x = e.pageX;
      const y = e.pageY;

      let disX = x - startX;
      let disY = y - startY;

      disX = disX * (100 / zoom);
      disY = disY * (100 / zoom);

      const oldStyle = cmp;

      const top = cmp.style.top + disY;
      const left = cmp.style.left + disX;

      this.context.updateSelectedCmp({ top, left });

      startX = x;
      startY = y;
    };

    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      this.context.recordCanvasChangeHistory();
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  setSelected = (e) => {
    e.stopPropagation();
    this.context.setSelectedCmpIndex(this.props.index);
  };

  // 伸缩组件(有小圆点才处理) style, top, left, width, height
  onMouseDown = (e) => {
    const direction = e.target.dataset.direction;
    if (!direction) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    const { cmp } = this.props;

    let startX = e.pageX;
    let startY = e.pageY;

    const move = (e) => {
      const x = e.pageX;
      const y = e.pageY;

      let disX = x - startX;
      let disY = y - startY;

      let newStyle = {};
      if (direction.indexOf("top") >= 0) {
        console.log("top update");
        disY = 0 - disY;
        newStyle.top = cmp.style.top - disY;
      }
      if (direction.indexOf("left") >= 0) {
        console.log("left update");
        disX = 0 - disX;
        newStyle.left = cmp.style.left - disX;
      }

      const newHeight = cmp.style.height + disY;

      Object.assign(newStyle, {
        width: cmp.style.width + disX,
        height: newHeight,
      });

      if (cmp.style.fontSize) {
        // 文本组件的行高，字体大小随高度变化
        const n = newHeight / cmp.style.height;
        let newFontSize = n * cmp.style.fontSize;
        newFontSize =
          newFontSize < 12 ? 12 : newFontSize > 130 ? 130 : newFontSize;
        Object.assign(newStyle, {
          width: cmp.style.width + disX,
          lineHeight: newHeight + "px",
          fontSize: newFontSize,
        });
      }

      this.context.updateSelectedCmp(newStyle);
      // 重设起始位置
      startX = x;
      startY = y;
    };

    const up = () => {
      // 删除事件
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      this.context.recordCanvasChangeHistory();
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  rotate = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { style } = this.props.cmp;
    const { width, height, transform } = style;

    const trans = parseFloat(transform);
    const r = height / 2;
    const ang = ((trans + 90) * Math.PI) / 180;
    const [offsetX, offsetY] = [-Math.cos(ang) * r, -Math.sin(ang) * r];

    let startX = e.pageX + offsetX;
    let startY = e.pageY + offsetY;

    const move = (e) => {
      let x = e.pageX;
      let y = e.pageY;

      let disX = x - startX;
      let disY = y - startY;

      let deg = (360 * Math.atan2(disY, disX)) / (2 * Math.PI) - 90;
      deg = deg.toFixed(2);

      this.context.updateSelectedCmp({
        transform: deg,
      });
    };
    const up = () => {
      // 删除事件
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      this.context.recordCanvasChangeHistory();
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  render() {
    const { cmp, selected } = this.props;
    const { style, value } = cmp;
    const { width, height } = style;
    const transform = `rotate(${style.transform}deg)`;
    return (
      <div
        id={cmp.key}
        className={styles.main}
        // draggable={true}
        // onDragStart={this.onDragStart}
        onMouseDown={this.onMouseDownOfCmp}
        onClick={this.setSelected}
      >
        {/* 组件本身 */}
        <div className={styles.cmp} style={{ ...style, transform }}>
          {getCmp(cmp)}
        </div>
        {/* 组件功能，选中样式 */}
        <ul
          className={classNames(
            styles.editStyle,
            selected ? styles.selected : styles.unselected
          )}
          style={{
            top: style.top - 2,
            left: style.left - 2,
            width: style.width,
            height: style.height,
            transform,
          }}
          onMouseDown={this.onMouseDown}
        >
          <li
            className={styles.stretchDot}
            style={{ top: -8, left: -8 }}
            data-direction="top left"
          />

          <li
            className={styles.stretchDot}
            style={{
              top: -8,
              left: width / 2 - 8,
            }}
            data-direction="top"
          />

          <li
            className={styles.stretchDot}
            style={{ top: -8, left: width - 8 }}
            data-direction="top right"
          />

          <li
            className={styles.stretchDot}
            style={{ top: height / 2 - 8, left: width - 8 }}
            data-direction="right"
          />

          <li
            className={styles.stretchDot}
            style={{
              top: height - 8,
              left: width - 8,
            }}
            data-direction="bottom right"
          />

          <li
            className={styles.stretchDot}
            style={{
              top: height - 8,
              left: width / 2 - 8,
            }}
            data-direction="bottom"
          />

          <li
            className={styles.stretchDot}
            style={{
              top: height - 8,
              left: -8,
            }}
            data-direction="bottom left"
          />
          <li
            className={styles.stretchDot}
            style={{
              top: height / 2 - 8,
              left: -8,
            }}
            data-direction="left"
          />

          <li
            className={classNames(styles.rotate, "iconfont icon-xuanzhuan")}
            style={{
              top: height + 8,
              left: width / 2 - 8,
            }}
            onMouseDown={this.rotate}
          />
        </ul>
      </div>
    );
  }
}

function getCmp(cmp) {
  switch (cmp.type) {
    case isTextComponent:
      return <Text {...cmp} />;
    case isImgComponent:
      return <Img {...cmp} />;
    default:
      break;
  }
}
