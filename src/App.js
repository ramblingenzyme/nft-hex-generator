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
      userImage
        .scan(
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
        )
        .getBase64Async(Jimp.MIME_PNG)
        .then(saveAs);
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
      <h1>make them bois hexagons</h1>
      <Dropzone
        onDrop={(dropped) => setImage(dropped[0])}
        noClick
        noKeyboard
        multiple={false}
        style={{ width: "500px", height: "500px" }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <AvatarEditor
              ref={editor}
              image={image}
              width={400}
              height={400}
              border={75}
              color={[255, 255, 255, 0.6]}
              scale={scale}
            />
            <div>
              <div style={{ display: "inline-flex" }}>
              <span>new file:</span>
              <input
                name="newImage"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                {...getInputProps()}
                style={{ display: "initial", marginLeft: "5px" }}
              />
              </div>
              <div style={{ display: "inline-flex" }}>
                <span>zoom:</span>
                <input
                  name="scale"
                  type="range"
                  onChange={setScale}
                  min={1}
                  max="2"
                  step="0.01"
                  defaultValue="1"
                  style={{ marginLeft: "5px" }}
                />
              </div>
            </div>
          </div>
        )}
      </Dropzone>
      <div style={{ display: "inline-flex", marginTop: "5px" }}>
        <span>hexagon that boi:</span>
        <input type="button" onClick={handleSave} value="yeaaaaa" style={{ marginLeft: "5px" }} />
      </div>
      <p>This will give you a 400x400 PNG with a transparent hexagon border.</p>
      <p>Uploading this to Twitter via the website or Android app is known to work.</p>
      <p>However the iOS app will strip the transparency. (Thanks <a href="https://twitter.com/pbrdmn">@pbrdmn</a> for discovering that.)</p>
      <p>Big thanks to <a href="https://twitter.com/eevee">@eevee</a> for putting the original template together.</p>
    </div>
  );
}

export default App;
