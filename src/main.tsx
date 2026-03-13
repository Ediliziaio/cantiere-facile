import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { configureNativeUI } from "./utils/native-ui";

configureNativeUI();

createRoot(document.getElementById("root")!).render(<App />);

