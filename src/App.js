import { useRef, useState } from "react";
import "./App.css";

import Fabric from "./components/Fabric/Fabric";
import InputFile from "./components/InputFile/InputFile";
import SelectionRect from "./components/SelectionRect/SelectionRect";

function App() {
  const canvas = useRef(null);
  const [initialImage, setInitialImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectionRect, setSelectionRect] = useState(null);

  const callbackCurrentImage = (value) => {
    setInitialImage(value);
  };
  const callbackInitialImage = (value) => {
    setCurrentImage(value);
  };

  const callbackSelectionRect = (value) => {
    setSelectionRect(value);
  };

  return (
    <div className="appContainer">
      <Fabric canvas={canvas} />

      <div className="buttons">
        <InputFile
          canvas={canvas}
          selectionRect={selectionRect}
          initialImage={initialImage}
          currentImage={currentImage}
          callbackCurrentImage={callbackCurrentImage}
          callbackInitialImage={callbackInitialImage}
        />

        <SelectionRect
          canvas={canvas}
          selectionRect={selectionRect}
          initialImage={initialImage}
          currentImage={currentImage}
          callbackSelectionRect={callbackSelectionRect}
          callbackCurrentImage={callbackCurrentImage}
        />
      </div>
    </div>
  );
}

export default App;
