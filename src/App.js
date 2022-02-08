import { useRef, useState, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import "./App.css";

import InputFile from "./components/InputFile/InputFile";
import SelectionRect from "./components/SelectionRect/SelectionRect";

function App() {
  const canvas = useRef(null);
  const canvasRef = useCallback((node) => {
    if (node) {
      canvas.current = new fabric.Canvas(node, {
        height: 600,
        width: 600,
        backgroundColor: "#f9f9fe",
        fireRightClick: true,
        fireMiddleClick: true,
        stopContextMenu: true
      });
    }
  }, []);

  const [initialImage, setInitialImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectionRect, setSelectionRect] = useState(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    canvas.current.on("mouse:down", handleInitAction);
    return () => canvas.current.off("mouse:down", handleInitAction);
  });

  useEffect(() => {
    canvas.current.on("mouse:down", handlemagnifier);
    return () => canvas.current.off("mouse:down", handlemagnifier);
  });

  const handlemagnifier = (e) => {
    if (e.button === 3) {
      const ctx = canvas.current.getContext("2d");
      const mouse = canvas.current.getPointer(e.e);

      const x = parseInt(mouse.x);
      const y = parseInt(mouse.y);

      const px = ctx.getImageData(x, y, 1, 1).data;
      setColor(`rgb(${px[0]}, ${px[1]}, ${px[2]})`);
    }
  };

  const handleInitAction = (e) => {
    const objects = canvas.current.getObjects();
    let rect = {};

    Object.keys(objects).forEach((el) => {
      if (objects[el].type === "rect") {
        rect = objects[el];
      }
    });

    const isRectEmpty = JSON.stringify(rect) === JSON.stringify({});

    if (!e.target) return false;

    if (e.target.type === "image" && !isRectEmpty) {
      e.target.set("opacity", 0.5);
    }

    if (e.button === 3 && !isRectEmpty) {
      e.target.set("opacity", 1);
      canvas.current.setActiveObject(rect);
    }
    canvas.current.renderAll();
  };

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
      <canvas ref={canvasRef} />

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

      {color && (
        <div className="color">
          picked color - {color}
          <div style={{ background: color }}></div>
        </div>
      )}
    </div>
  );
}

export default App;
