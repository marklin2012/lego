import { isTextComponent } from "../../layout/Left";
import { useCanvasByContext } from "../../store/hooks";
import styles from "./index.less";
const defaultStyle = {
  position: "absolute",
  top: 1,
  left: 0,
  width: 80,
  height: 30,
  lineHeight: "30px",
  fontSize: 12,
  fontWeight: "normal",
  color: "#000",
  backgroundColor: "#ffffff00",
  textAlign: "left",
  borderRadius: "0%",
  borderStyle: "none",
  borderWidth: "0",
  borderColor: "#ffffff00",
};

const settings = [
  {
    value: "标题",
    style: {
      ...defaultStyle,
      fontSize: 28,
      height: 50,
      lineHeight: "50px",
    },
  },
  {
    value: "正文",
    style: defaultStyle,
  },
];
export default function TextSide() {
  const canvas = useCanvasByContext();
  const addCmp = (_cmp) => {
    canvas.addCmp(_cmp);
  };
  return (
    <div className={styles.main}>
      <ul className={styles.box}>
        {settings.map((item) => (
          <li
            className={styles.item}
            key={item.value}
            onClick={() => addCmp({ ...item, type: isTextComponent })}
          >
            {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
