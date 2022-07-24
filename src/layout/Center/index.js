import { useCanvasByContext } from "../../store/hooks";
import Cmp from "../../components/Cmp";
import styles from "./index.less";
import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";

export default function Center(props) {
  const canvas = useCanvasByContext();
  const canvasData = canvas.getCanvas();
  const { style, cmps } = canvasData;
  const onDrop = useCallback((e) => {
    // 拖拽的开始位置
    const endX = e.pageX;
    const endY = e.pageY;

    const start = e.dataTransfer.getData("text").split(",");
    const disX = endX - start[0];
    const disY = endY - start[1];

    const selectedCmp = canvas.getSelectedCmp();
    const oldStyle = selectedCmp.style;
    const top = oldStyle.top + disY;
    const left = oldStyle.left + disX;

    canvas.updateSelectedCmp({ top, left });
  }, []);

  const allowDrop = useCallback((e) => {
    e.preventDefault();
  }, []);

  const selectedIndex = canvas.getSelectedCmpIndex();
  useEffect(() => {
    document.getElementById("center").addEventListener("click", () => {
      canvas.setSelectedCmpIndex(-1);
    });
    document.getElementById("center").onkeydown = whichKeyEvent;
    return () => {};
  }, []);

  const whichKeyEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedCmp = canvas.getSelectedCmp();
    if (!selectedCmp) {
      return;
    }

    if (e.keyCode < 37 || e.keyCode > 40) {
      return;
    }

    const { top, left } = selectedCmp.style;
    const newStyle = { top, left };
    switch (e.keyCode) {
      case 37:
        newStyle.left -= 1;
        break;
      case 38:
        newStyle.top -= 1;
        break;
      case 39:
        newStyle.left += 1;
        break;
      case 40:
        newStyle.top += 1;
        break;
      default:
        break;
    }
    canvas.updateSelectedCmp(newStyle);
  };

  // 缩放比例
  const [zoom, setZoom] = useState(() =>
    parseInt(canvasData.style.width) > 800 ? 50 : 100
  );
  return (
    <div id="center" className={styles.main} tabIndex="0">
      <div
        className={styles.canvas}
        style={{
          ...canvasData.style,
          backgroundImage: `url(${canvasData.style.backgroundImage})`,
          transform: `scale(${zoom / 100})`,
        }}
        onDrop={onDrop}
        onDragOver={allowDrop}
      >
        {cmps.map((cmp, index) => (
          <Cmp
            key={cmp.key}
            cmp={cmp}
            selected={selectedIndex === index}
            index={index}
          />
        ))}
      </div>
      <ul className={styles.zoom}>
        <li
          className={classNames(styles.icon)}
          onClick={() => {
            setZoom(zoom + 25);
          }}
        >
          +
        </li>
        <li className={classNames(styles.num)}>
          <input
            type="num"
            value={zoom}
            onChange={(e) => {
              let newValue = e.target.value;
              newValue = newValue >= 1 ? newValue : 1;
              setZoom(newValue - 0);
            }}
          />
          %
        </li>
        <li
          className={classNames(styles.icon)}
          onClick={() => {
            const newZoom = zoom - 25 >= 1 ? zoom - 25 : 1;
            setZoom(newZoom);
          }}
        >
          -
        </li>
      </ul>
    </div>
  );
}
