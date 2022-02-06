import { useEffect, useState } from "react";
import { fabric } from "fabric";
import "./App.css";

// const imageURL =
//   "https://www.kaspersky.com/content/en-global/images/product-icon-KSOS.png";

function App() {
  const [canvas, setCanvas] = useState("");
  // const [isCroped, setIsCroped] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  // const [restoreImage, setRestoreImage] = useState(null);
  let selectionRect = null;
  let currentImage = null;

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  // useEffect(() => {
  //   document.addEventListener("keydown", handleDeclineCrop);
  //   return () => {
  //     document.removeEventListener("keydown", handleDeclineCrop);
  //   };
  // });

  const initCanvas = () => {
    const init = new fabric.Canvas("canvas", {
      height: 600,
      width: 600,
      backgroundColor: "#f9f9fe",
      fireRightClick: true,
      fireMiddleClick: true,
      stopContextMenu: true
    });
    init.on("mousedown", handleInitAction);

    return init;
  };

  const handleInitAction = ({ button }) => {
    if (button === 2) {
      if (!selectionRect) return false;
      handleCrop();
    }
  };

  // const handleDeclineCrop = ({ keyCode }) => {
  //   if (keyCode === 27) {
  //     if (!isCroped) return false;
  //     // setCanvas("");
  //     // canvas.clear();
  //     // canvas.dispose();
  //     setCanvas(initCanvas());
  //     // canvas.remove(selectionRect);
  //     canvas.add(restoreImage);
  //     // canvas.centerObject(currentImage);
  //     canvas.renderAll();
  //     // canvas.add(currentImage);
  //     // canvas.renderAll();
  //     // setIsCroped(false);
  //     // setIsUploaded(false);
  //     setDownloadLink("");
  //   }
  // };

  const saveImage = () => {
    setDownloadLink(
      canvas.toDataURL({
        format: "png"
      })
    );
  };

  const setOpacity = () => {
    if (!selectionRect) return false;
    currentImage.set("opacity", 0.5);
  };

  const handleImageAction = ({ button }) => {
    if (button === 2) {
      if (!selectionRect) return false;

      handleCrop();
    }
    if (button === 3) {
      if (!selectionRect) return false;

      canvas.setActiveObject(selectionRect);
      currentImage.set("opacity", 1);
      canvas.renderAll();
    }
  };

  const handleSelectionRectAction = ({ button }) => {
    if (button === 2) {
      if (!selectionRect) return false;
      handleCrop();
    }
  };

  const onDrop = (onDropEvent) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const imgObj = new Image();

      imgObj.src = event.target.result;

      imgObj.onload = () => {
        const image = new fabric.Image(imgObj);

        image.on("mousedblclick", addSelectionRect);
        image.on("mousemove", setOpacity);
        image.on("mousedown", handleImageAction);
        // setRestoreImage(image);
        canvas.centerObject(image);
        canvas.add(image);
        canvas.renderAll();
        currentImage = image;
      };
    };

    reader.readAsDataURL(onDropEvent.target.files[0]);
    setIsUploaded(true);
  };

  const addSelectionRect = () => {
    if (selectionRect) return false;

    selectionRect = new fabric.Rect({
      fill: "rgba(0,0,0,0.3)",
      stroke: "#6A93D4",
      opacity: 1,
      width: 150,
      height: 150,
      cornerColor: "#6A93D4",
      transparentCorners: false,
      borderColor: "#6A93D4",
      cornerSize: 8
    });

    selectionRect.on("mousedown", handleSelectionRectAction);
    canvas.setActiveObject(selectionRect);
    canvas.centerObject(selectionRect);
    canvas.add(selectionRect);
  };

  const handleCrop = () => {
    // setIsCroped(true);
    currentImage.set("opacity", 1);
    const rect = new fabric.Rect({
      left: selectionRect.left,
      top: selectionRect.top,
      width: selectionRect.getScaledWidth(),
      height: selectionRect.getScaledHeight(),
      absolutePositioned: true
    });

    currentImage.clipPath = rect;

    canvas.remove(selectionRect);

    const cropped = new Image();

    cropped.src = canvas.toDataURL({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    });

    cropped.onload = () => {
      const image = new fabric.Image(cropped);
      image.left = rect.left;
      image.top = rect.top;
      canvas.remove(currentImage);
      canvas.add(image);
      canvas.renderAll();
    };
    saveImage();
  };

  return (
    <div className="appContainer">
      {!isUploaded && (
        <input
          type="file"
          onChange={onDrop}
          accept="image/png, image/jpeg, image/jpg"
        />
      )}
      <canvas id="canvas" />

      {downloadLink && (
        <a download="image.png" href={downloadLink}>
          Save image
        </a>
      )}
    </div>
  );
}

export default App;
