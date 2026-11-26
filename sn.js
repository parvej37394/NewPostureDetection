
let capture;
let posenet;

let singlePose;
let skeleton;

let ac_img;
let selectedImage = "dog.jpg";

function setup() {

    createCanvas(800, 500);

    capture = createCapture(VIDEO);
    capture.size(800, 500);
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose', receivedPoses);

    // Load default image
    ac_img = loadImage('images/dog.jpg');

    // Image selection
    let selector = document.getElementById("imageSelect");

    selector.addEventListener("change", function() {

        selectedImage = this.value;

        ac_img = loadImage(
            'images/' + selectedImage,
            () => console.log("Image loaded: " + selectedImage),
            () => console.log("Image loading failed")
        );

    });
}

function receivedPoses(poses) {

    if (poses.length > 0) {

        singlePose = poses[0].pose;
        skeleton = poses[0].skeleton;

    }
}

function modelLoaded() {
    console.log("PoseNet Model Loaded");
}

function draw() {

    background(0);

    image(capture, 0, 0, 800, 500);

    if (singlePose) {

        // Keypoints
        fill(211, 89, 190);
        noStroke();

        for (let i = 0; i < singlePose.keypoints.length; i++) {

            let keypoint = singlePose.keypoints[i];

            if (keypoint.score > 0.2) {

                ellipse(
                    keypoint.position.x,
                    keypoint.position.y,
                    10,
                    10
                );
            }
        }

        // Skeleton
        stroke(11, 255, 97);
        strokeWeight(3);

        for (let i = 0; i < skeleton.length; i++) {

            let [a, b] = skeleton[i];

            if (a.score > 0.2 && b.score > 0.2) {

                line(
                    a.position.x,
                    a.position.y,
                    b.position.x,
                    b.position.y
                );
            }
        }

        // Dynamic Image Size
        if (
            ac_img &&
            ac_img.width > 0 &&
            singlePose.leftEye.confidence > 0.2 &&
            singlePose.rightEye.confidence > 0.2
        ) {

            let eyeDistance = dist(
                singlePose.leftEye.x,
                singlePose.leftEye.y,
                singlePose.rightEye.x,
                singlePose.rightEye.y
            );

            let imgSize = map(
                eyeDistance,
                20,
                150,
                50,
                200
            );

            imgSize = constrain(imgSize, 50, 200);

            image(
                ac_img,
                singlePose.nose.x - imgSize / 2,
                singlePose.nose.y - imgSize / 2,
                imgSize,
                imgSize
            );
        }
    }
}
