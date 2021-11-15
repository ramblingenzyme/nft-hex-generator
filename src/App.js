import logo from "./logo.svg";
import "./App.css";
import AvatarEditor from "react-avatar-editor";
import React, { useState, useRef } from "react";
import Dropzone from "react-dropzone";
import Jimp from "jimp";
import { saveAs } from "file-saver";

import HexBitmap from "./nft_hexagon_400x400.png";

const useScale = () => {
  const [scale, setScale] = useState(1);

  return [
    scale,
    (e) => {
      const scale = parseFloat(e.target.value);
      setScale(scale);
    },
  ];
};

const hexagonThatBoy = (userImage: HTMLCanvasElement) => {
  const imageDataUrl = userImage.toDataURL();

  Promise.all([Jimp.read(imageDataUrl), Jimp.read(HexBitmap)]).then(
    ([userImage, hexBitmap]) => {
      userImage.scan(
        0,
        0,
        userImage.bitmap.width,
        userImage.bitmap.height,
        function (x, y, idx) {
          const { r, g, b } = Jimp.intToRGBA(hexBitmap.getPixelColor(x, y));
          if (r === 255 && g === 255 && b === 255) {
            this.bitmap.data[idx + 3] = 0;
          }
        }
      ).getBase64Async(Jimp.MIME_PNG).then(x => saveAs(x));
    }
  );
};

function App() {
  const [scale, setScale] = useScale();
  const [image, setImage] = useState();
  const editor = useRef();

  const handleSave = () => {
    if (editor.current) {
      const image = editor.current.getImageScaledToCanvas();
      hexagonThatBoy(image);
    }
  };

  return (
    <div className="App">
      <Dropzone
        onDrop={(dropped) => setImage(dropped[0])}
        noClick
        noKeyboard
        multiple={false}
        style={{ width: "400px", height: "400px" }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <AvatarEditor
              ref={editor}
              image={image}
              width={400}
              height={400}
              color={[255, 255, 255, 0.6]}
              scale={scale}
            />
            <br />
            New file:
            <input
              name="newImage"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              {...getInputProps()}
              style={{ display: "initial" }}
            />
          </div>
        )}
      </Dropzone>
      <br />
      Zoom:
      <input
        name="scale"
        type="range"
        onChange={setScale}
        min={1}
        max="2"
        step="0.01"
        defaultValue="1"
      />
      <br />
      Hexagon that boy:
      <input type="button" onClick={handleSave} value="Hexagon boi" />
    </div>
  );
}

export default App;
