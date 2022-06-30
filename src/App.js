import styles from "./App.less";
import Header from "./layout/Header";
import Left from "./layout/Left";
import Center from "./layout/Center";
import Right from "./layout/Right";
import { CanvasContext } from "./context";
import { useCanvas } from "./store/hooks";
import { useReducer, useEffect } from "react";

function App() {
  const canvas = useCanvas();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    const unsubscribe = canvas.subscribe(() => {
      forceUpdate();
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div className={styles.main}>
      <CanvasContext.Provider value={canvas}>
        <Header />
        <div className={styles.content}>
          <Left />
          <Center />
          <Right />
        </div>
      </CanvasContext.Provider>
    </div>
  );
}

export default App;
