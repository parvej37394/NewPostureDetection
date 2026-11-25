
let capture;
let posenet;

let singlePose;
let skeleton;
let ac_img;

function setup() {
    createCanvas(800, 500);

    capture = createCapture(VIDEO);
    capture.size(800, 500);
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);

    posenet.on('pose', receivedPoses);

    ac_img = loadImage(
        'doges.jpg',
        () => console.log("Image Loaded Successfully"),
        () => console.log("Image Loading Failed")
    );
}

function receivedPoses(poses) {
    if (poses.length > 0) {
        singlePose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function modelLoaded() {
    console.log("PoseNet model loaded");
}

function draw() {
    background(0);

    if (capture) {
        image(capture, 0, 0, 800, 500);
    }

    if (singlePose) {

        // Draw Keypoints
        fill(211, 89, 190);
        noStroke();

        for (let i = 0; i < singlePose.keypoints.length; i++) {
            const keypoint = singlePose.keypoints[i];

            if (keypoint.score > 0.2) {
                ellipse(
                    keypoint.position.x,
                    keypoint.position.y,
                    10,
                    10
                );
            }
        }

        // Draw Skeleton
        stroke(11, 255, 97);
        strokeWeight(5);

        for (let i = 0; i < skeleton.length; i++) {
            const [a, b] = skeleton[i];

            if (a.score > 0.2 && b.score > 0.2) {
                line(
                    a.position.x,
                    a.position.y,
                    b.position.x,
                    b.position.y
                );
            }
        }

      if (ac_img && ac_img.width > 0) {
            image(
                ac_img,
                singlePose.nose.x - 50,
                singlePose.nose.y - 50,
                100,
                100
            );
        }

        
    }
    
}
