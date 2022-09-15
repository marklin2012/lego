import styles from "./index.less";
import { Component } from "react";
import { CanvasContext } from "../../context";
import { isImgComponent, isTextComponent } from "../../layout/Left";
import Img from "../Img";
import Text from "../Text";

// TODO: 拖拽，删除，改变层级关系
export default class Cmp extends Component {
  static contextType = CanvasContext;

  setSelected = (e) => {
    e.stopPropagation();
    this.context.setSelectedCmpIndex(this.props.index);
  };

  render() {
    const { cmp, index } = this.props;
    const { style } = cmp;
    const { width, height } = style;
    const transform = `rotate(${style.transform}deg)`;
    const zIndex = index;
    return (
      <div
        id={cmp.key}
        className={styles.main}
        style={{ ...style, transform, zIndex }}
        onClick={this.setSelected}
      >
        {/* 组件本身 */}
        <div
          className={styles.cmp}
          style={{ width: style.width, height: style.height }}
        >
          {cmp.type === isTextComponent && <Text {...cmp} />}
          {cmp.type === isImgComponent && <Img {...cmp} />}
        </div>
      </div>
    );
  }
}
