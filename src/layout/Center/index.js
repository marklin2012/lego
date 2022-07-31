import { useCanvasByContext } from "../../store/hooks";
import Cmp from "../../components/Cmp";
import styles from "./index.less";
import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";

export default function Center(props) {
  const canvas = useCanvasByContext();
  const canvasData = canvas.getCanvas();
  const { style, cmps } = canvasData;

  // 缩放比例
  const [zoom, setZoom] = useState(() =>
    parseInt(canvasData.style.width) > 800 ? 50 : 100
  );

  const onDrop = useCallback(
    (e) => {
      // 拖拽的开始位置
      const endX = e.pageX;
      const endY = e.pageY;

      let dragCmp = e.dataTransfer.getData("drag-cmp");
      if (!dragCmp) {
        console.log("none exist");
        return;
      }

      dragCmp = JSON.parse(dragCmp);
      console.log(
        "xxx: ",
        document.body.clientWidth / 2 - (style.width / 2) * (zoom / 100)
      );
      // 画布位置
      const canvasDOMPos = {
        top: 110,
        left: document.body.clientWidth / 2 - (style.width / 2) * (zoom / 100),
      };

      const startX = canvasDOMPos.left;
      const startY = canvasDOMPos.top;

      let disX = endX - startX;
      let disY = endY - startY;

      disX = disX * (100 / zoom);
      disY = disY * (100 / zoom);
      dragCmp.style.left = disX - dragCmp.style.width / 2;
      dragCmp.style.top = disY - dragCmp.style.height / 2;

      canvas.addCmp(dragCmp);
    },
    [zoom, style.width]
  );

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
    const selectedCmp = canvas.getSelectedCmp();
    if (!selectedCmp) {
      return;
    }

    if (e.keyCode < 37 || e.keyCode > 40) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    const { top, left } = selectedCmp.style;
    const newStyle = { top, left };
    switch (e.keyCode) {
      case 37: // 左
        newStyle.left -= 1;
        break;
      case 38: // 上
        newStyle.top -= 1;
        break;
      case 39: // 右
        newStyle.left += 1;
        break;
      case 40: // 下
        newStyle.top += 1;
        break;
      default:
        break;
    }
    canvas.updateSelectedCmp(newStyle);
  };

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
            zoom={zoom}
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
