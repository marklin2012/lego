import { useContext } from "react";
import { useCanvasByContext } from "../../../store/hooks";
import styles from "./index.less";
import classNames from "classnames";

export default function ContextMenu({ index, style, cmp }) {
  const canvas = useCanvasByContext();
  const copy = (e) => {
    e.stopPropagation();

    const newCmp = JSON.parse(JSON.stringify(cmp));
    newCmp.style.top += 40;
    newCmp.style.left += 40;
    canvas.addCmp(newCmp);
  };

  const del = (e) => {
    e.stopPropagation();
    canvas.deleteCmp(index);
  };

  const addCmpIndex = (e) => {
    e.stopPropagation();
    canvas.addCmpIndex(index);
  };

  const subCmpIndex = (e) => {
    e.stopPropagation();
    canvas.subCmpIndex(index);
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
      <li className={styles.item}>置顶</li>
      <li className={styles.item}>置底</li>
    </ul>
  );
}
