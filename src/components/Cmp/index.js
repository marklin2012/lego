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

  onDragStart = (e) => {
    this.setSelected();
    // 拖拽的开始位置
    const startX = e.pageX;
    const startY = e.pageY;

    e.dataTransfer.setData("text", startX + "," + startY);
  };

  setSelected = () => {
    this.context.setSelectedCmpIndex(this.props.index);
  };

  // 伸缩组件(有小圆点才处理) style, top, left, width, height
  onMouseDown = (e) => {
    const direction = e.target.dataset.direction;
    if (!direction) {
      return;
    }

    console.log("xxxx");
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
      console.log(`disX: ${disX},disY: ${disY}`);

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

      Object.assign(newStyle, {
        width: cmp.style.width + disX,
        height: cmp.style.height + disY,
      });
      console.log("newStyle", newStyle);
      this.context.updateSelectedCmp(newStyle);
      // 重设起始位置
      startX = x;
      startY = y;
    };

    const up = () => {
      // 删除事件
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mousemup", up);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  render() {
    const { cmp, selected } = this.props;
    const { style, value } = cmp;
    const { width, height } = style;
    return (
      <div
        className={styles.main}
        draggable={true}
        onDragStart={this.onDragStart}
        onClick={this.setSelected}
      >
        {/* 组件本身 */}
        <div className={styles.cmp} style={style}>
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
  }
}
