import { useContext } from "react";
import { useCanvasByContext } from "../../../store/hooks";
import styles from "./index.less";
import classNames from "classnames";

export default function ContextMenu({
  index,
  style,
  cmp,
  hideShowContextMenu,
}) {
  const canvas = useCanvasByContext();
  const copy = (e) => {
    e.stopPropagation();

    const newCmp = JSON.parse(JSON.stringify(cmp));
    newCmp.style.top += 40;
    newCmp.style.left += 40;
    canvas.addCmp(newCmp);
    hideShowContextMenu();
  };

  const del = (e) => {
    e.stopPropagation();
    canvas.deleteCmp(index);
    hideShowContextMenu();
  };

  const addCmpIndex = (e) => {
    e.stopPropagation();
    canvas.addCmpIndex(index);
    hideShowContextMenu();
  };

  const subCmpIndex = (e) => {
    e.stopPropagation();
    canvas.subCmpIndex(index);
    hideShowContextMenu();
  };

  const topZIndex = (e) => {
    e.stopPropagation();
    canvas.topZIndex(index);
    hideShowContextMenu();
  };

  const bottomZIndex = (e) => {
    e.stopPropagation();
    canvas.bottomZIndex(index);
    hideShowContextMenu();
  };

  return (
    <ul className={classNames(styles.main)} style={style}>
      <li className={styles.item} onClick={copy}>
        复制
      </li>
      <li className={styles.item} onClick={del}>
        删除
      </li>
      <li className={styles.item} onClick={addCmpIndex}>
        上移一层
      </li>
      <li className={styles.item} onClick={subCmpIndex}>
        下移一层
      </li>
      <li className={styles.item} onClick={topZIndex}>
        置顶
      </li>
      <li className={styles.item} onClick={bottomZIndex}>
        置底
      </li>
    </ul>
  );
}
