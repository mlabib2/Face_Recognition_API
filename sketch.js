let video;
let faceapi;
let detections;

function setup() {
  createCanvas(640, 480);
  video = createCapture({
    audio: false,
    video: {
      facingMode: "user",
      width: 640,
      height: 480
    }
  }, () => {
    video.hide();
    faceapi = ml5.faceApi(video, { maxFaces: 1 }, modelReady);
  });
}

function modelReady() {
  console.log("Model ready!");
  faceapi.detect(gotResults);
}

function gotResults(err, results) {
  if (err) {
    console.error(err);
    return;
  }
  detections = results;
  faceapi.detect(gotResults);
}

function draw() {
  image(video, 0, 0, width, height);
  if (detections) {
    if (detections.length > 0) {
      drawBox(detections);
      drawLandmarks(detections);
    }
  }
}

function drawBox(detections) {
  noFill();
  stroke(0, 255, 0);
  strokeWeight(2);
  for (let i = 0; i < detections.length; i++) {
    const alignedRect = detections[i].alignedRect;
    const { _x, _y, _width, _height } = alignedRect._box;
    rect(_x, _y, _width, _height);
  }
}

function drawLandmarks(detections) {
  for (let i = 0; i < detections.length; i++) {
    const mouth = detections[i].parts.mouth;
    const nose = detections[i].parts.nose;
    const leftEye = detections[i].parts.leftEye;
    const rightEye = detections[i].parts.rightEye;
    const leftEyeBrow = detections[i].parts.leftEyeBrow;
    const rightEyeBrow = detections[i].parts.rightEyeBrow;

    drawPart(mouth, false);
    drawPart(nose, false);
    drawPart(leftEye, true);
    drawPart(rightEye, true);
    drawPart(leftEyeBrow, false);
    drawPart(rightEyeBrow, false);
  }
}

function drawPart(feature, closed) {
  beginShape();
  for (let i = 0; i < feature.length; i++) {
    const x = feature[i]._x;
    const y = feature[i]._y;
    vertex(x, y);
  }
  if (closed) {
    endShape(CLOSE);
  } else {
    endShape();
  }
}