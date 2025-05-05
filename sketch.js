// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX = 320;
let circleY = 240;
let circleSize = 50;
let isDragging = false;
let previousX, previousY;

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  // 每次重繪畫布，清除之前的內容
  background(220);

  // 顯示攝影機影像
  image(video, 0, 0);

  // 繪製圓形
  fill(255, 0, 0, 150);
  noStroke();
  circle(circleX, circleY, circleSize);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    let handDetected = false; // 檢測是否有手指接觸圓形

    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 檢查食指指尖 (keypoint 8) 是否接觸圓形
        let keypoint = hand.keypoints[8];
        let d = dist(keypoint.x, keypoint.y, circleX, circleY);

        if (d < circleSize / 2) {
          // 移動圓形以跟隨食指
          circleX = keypoint.x;
          circleY = keypoint.y;

          // 繪製軌跡線
          if (isDragging) {
            stroke(0, 0, 255);
            strokeWeight(8); // 設定線條粗度為 8
            line(previousX, previousY, keypoint.x, keypoint.y);
          }

          // 更新上一個位置
          previousX = keypoint.x;
          previousY = keypoint.y;

          isDragging = true;
          handDetected = true;
        }

        // 繪製食指指尖的可視化點
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 16);
      }
    }

    // 如果沒有手指接觸圓形，停止繪製軌跡
    if (!handDetected) {
      isDragging = false;
    }
  }
}
