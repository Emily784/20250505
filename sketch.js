// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleSize = 100;

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

  // Initialize circle position
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw the circle
  fill(255, 0, 0, 150);
  noStroke();
  circle(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Check if keypoint 8 (index finger tip) is touching the circle
        let keypoint = hand.keypoints[8];
        let d = dist(keypoint.x, keypoint.y, circleX, circleY);

        if (d < circleSize / 2) {
          // Move the circle to follow the keypoint
          circleX = keypoint.x;
          circleY = keypoint.y;
        }

        // Draw the keypoint for visualization
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 16);
      }
    }
  }
}
