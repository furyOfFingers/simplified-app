import { useState } from "react";
import { fabric } from "fabric";

function SelectionRect({
  canvas,
  selectionRect,
  currentImage,
  callbackSelectionRect,
  callbackCurrentImage
}) {
  const [isCropped, setIsCropped] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  // const handleDeclineCrop = () => {
  //   // canvas.current.clear();
  //   canvas.current.remove(currentImage);
  //   canvas.current.centerObject(initialImage);
  //   canvas.current.add(initialImage);
  //   canvas.current.renderAll();

  //   callbackCurrentImage(initialImage);
  // };
  const saveImage = () => {
    setDownloadLink(
      canvas.current.toDataURL({
        format: "png"
      })
    );
  };
  const handleCrop = () => {
    currentImage.set("opacity", 1);
    const rect = new fabric.Rect({
      left: selectionRect.left,
      top: selectionRect.top,
      width: selectionRect.getScaledWidth(),
      height: selectionRect.getScaledHeight(),
      absolutePositioned: true
    });

    currentImage.clipPath = rect;

    canvas.current.remove(selectionRect);

    const cropped = new Image();

    cropped.src = canvas.current.toDataURL({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    });

    cropped.onload = () => {
      const image = new fabric.Image(cropped);
      image.left = rect.left;
      image.top = rect.top;
      canvas.current.remove(currentImage);
      canvas.current.add(image);
      canvas.current.renderAll();
    };
    callbackCurrentImage(currentImage);
    setIsCropped(true);
    saveImage();
  };

  const addSelectionRect = () => {
    const newSelectionRect = new fabric.Rect({
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

    canvas.current.setActiveObject(newSelectionRect);
    canvas.current.centerObject(newSelectionRect);
    canvas.current.add(newSelectionRect);
    canvas.current.renderAll();
    callbackSelectionRect(newSelectionRect);
  };

  const renderButton = () => {
    if (selectionRect) {
      return isCropped ? null : (
        // <button onClick={handleDeclineCrop}>decline crop</button>
        <button onClick={handleCrop}>crop</button>
      );
    } else {
      return !currentImage ? null : (
        <button onClick={addSelectionRect}>add rectangle</button>
      );
    }
  };

  return (
    <>
      {renderButton()}
      {downloadLink && (
        <a download="image.png" href={downloadLink}>
          download image
        </a>
      )}
    </>
  );
}

export default SelectionRect;
