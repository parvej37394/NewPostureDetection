

let capture;
let posenet;

let singlePose;
let skeleton;

let ac_img;
let selectedImage = "dogess.jpg";

function setup() {

    createCanvas(800, 500);

    // Webcam Capture
    capture = createCapture(VIDEO);
    capture.size(800, 500);
    capture.hide();

    // PoseNet Model
    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose', receivedPoses);

    // Load Default Image
    loadSelectedImage(selectedImage);

    // Image Selection
    let selector = document.getElementById("imageSelect");

    selector.addEventListener("change", function() {

        selectedImage = this.value;

        loadSelectedImage(selectedImage);

    });

}


// Image Loading Function
function loadSelectedImage(imageName) {

    ac_img = loadImage(

        imageName,

        function() {
            console.log("Image Loaded:", imageName);
        },

        function(error) {
            console.log("Image Loading Failed:", imageName, error);
        }

    );

}


// PoseNet Model Loaded
function modelLoaded() {

    console.log("PoseNet Model Loaded Successfully");

}


// Receive Pose Data
function receivedPoses(poses) {

    if (poses.length > 0) {

        singlePose = poses[0].pose;

        skeleton = poses[0].skeleton;

    }

}


// Draw Function
function draw() {

    background(0);

    // Webcam Display
    image(capture, 0, 0, 800, 500);


    if (singlePose) {

        // Keypoints Detection
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


        // Skeleton Detection
        stroke(11, 255, 97);

        strokeWeight(3);

        if (skeleton) {

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

        }


        // Dynamic Image Size Based on Eye Distance
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
            
            let imgSize = map(eyeDistance, 10, 100, 30, 150);
            imgSize = constrain(imgSize, 30, 150);
            
            image(ac_img, singlePose.nose.x - imgSize / 2,
                  singlePose.nose.y - imgSize / 2, imgSize, imgSize);
            
                        );


            let imgSize = map(

                eyeDistance,
                20,
                150,
                50,
                200

            );


            imgSize = constrain(imgSize, 50, 200);


            // Display Selected Image Near Nose
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


