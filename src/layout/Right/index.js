import EditCanvas from "../../components/EditCanvas";
import EditCmp from "../../components/EditCmp";
import { useCanvasByContext } from "../../store/hooks";
import styles from "./index.less";

export default function Right(props) {
  const canvas = useCanvasByContext();
  const selectedCmp = canvas.getSelectedCmp();

  return selectedCmp ? <EditCmp /> : <EditCanvas />;
}
