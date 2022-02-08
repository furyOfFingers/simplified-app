import { useCallback } from "react";
import { fabric } from "fabric";

const useFabric = (canvas) => {
  const fabricRef = useCallback((element) => {
    if (!element) return canvas.current?.dispose();

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

    canvas.current = new fabric.Canvas(element, {
      height: 600,
      width: 600,
      backgroundColor: "#f9f9fe",
      fireRightClick: true,
      fireMiddleClick: true,
      stopContextMenu: true
    });

    canvas.current.on("mouse:down", handleInitAction);
  }, []);

  return fabricRef;
};

function MyFabric({ canvas }) {
  const fabricRef = useFabric(canvas);

  return <canvas ref={fabricRef} />;
}

export default MyFabric;
