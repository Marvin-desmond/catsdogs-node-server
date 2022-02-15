import * as tf from "@tensorflow/tfjs";
import { loadGraphModel } from "@tensorflow/tfjs-converter";
// Define "require"
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const  glob = require("glob"),
  Jimp = require("jimp"),
  data_folder = "../imgs/run",
  MODEL_URL = "http://127.0.0.1:8081/model.json",
  model = await loadGraphModel(MODEL_URL);

let getData = () => {
  let temp = glob.sync(`${data_folder}/*.jpg`);
  return temp;
};


let ImageLoader = async () => {
    const res = getData();
    try {
      for (const path of res) {
        let image = await Jimp.read(path)
          .then(data=>{
            return data.resize(224, 224).bitmap;
          });
        let img = tf.browser.fromPixels(image);
        img = img.expandDims(0);
        console.log("Onto prediction line...");
        let output = model.predict(img);
        console.log(`${path} : Prediction = ${output}`);
      }
    } catch (e) {
      console.log(e);
    }
};

await ImageLoader();



