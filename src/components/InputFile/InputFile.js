import { fabric } from "fabric";

function InputFile({
  canvas,
  currentImage,
  callbackCurrentImage,
  callbackInitialImage
}) {
  const onDrop = (onDropEvent) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const imgObj = new Image();

      imgObj.src = event.target.result;

      imgObj.onload = () => {
        const image = new fabric.Image(imgObj);

        canvas.current.centerObject(image);
        canvas.current.add(image);
        canvas.current.renderAll();
        callbackCurrentImage(image);
        callbackInitialImage(image);
      };
    };

    reader.readAsDataURL(onDropEvent.target.files[0]);
  };

  return currentImage ? null : (
    <input
      type="file"
      onChange={onDrop}
      accept="image/png, image/jpeg, image/jpg"
    />
  );
}

export default InputFile;
