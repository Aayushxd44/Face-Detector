//  import React, { useEffect,  useState } from 'react';
//  import * as faceapi from 'face-api.js';
//  import './FaceRecognition.css';
 
//  const FaceRecognition = ({ videoRef, handleVideoOnPlay, detections }) => {
//    const [capturedImages, setCapturedImages] = useState([]);
 
//    useEffect(() => {
//      const startVideo = () => {
//        navigator.mediaDevices
//          .getUserMedia({ video: {} })
//          .then((stream) => {
//            videoRef.current.srcObject = stream;
//          })
//          .catch((err) => console.error(err));
//      };
 
//      startVideo();
//    }, [videoRef]);
 
//    useEffect(() => {
//      if (videoRef.current) {
//        videoRef.current.addEventListener('play', () => {
//          const canvas = faceapi.createCanvasFromMedia(videoRef.current);
//          const displaySize = {
//            width: videoRef.current.width,
//            height: videoRef.current.height,
//          };
//          faceapi.matchDimensions(canvas, displaySize);
 
//          const drawDetections = () => {
//            const context = canvas.getContext('2d');
//            context.clearRect(0, 0, canvas.width, canvas.height);
//            const resizedDetections = faceapi.resizeResults(detections, displaySize);
//            faceapi.draw.drawDetections(canvas, resizedDetections);
//            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//          };
 
//          if (detections.length > 0) {
//            drawDetections();
//          }
//        });
//      }
//    }, [detections, videoRef]);
 
//    const captureImage = () => {
//      const video = videoRef.current;
 
//      if (video) {
//        const canvas = document.createElement('canvas');
//        canvas.width = video.videoWidth;
//        canvas.height = video.videoHeight;
 
//        const context = canvas.getContext('2d');
//        context.drawImage(video, 0, 0, canvas.width, canvas.height);
 
//        // Draw detections and expressions on the canvas
//        if (detections.length > 0) {
//          const resizedDetections = faceapi.resizeResults(detections, {
//            width: canvas.width,
//            height: canvas.height,
//          });
//          faceapi.draw.drawDetections(canvas, resizedDetections);
//          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//        }
 
//        const dataUrl = canvas.toDataURL('image/jpeg');
//        setCapturedImages([...capturedImages, dataUrl]);
 
//        const byteString = atob(dataUrl.split(',')[1]);
//        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
//        const ab = new ArrayBuffer(byteString.length);
//        const ia = new Uint8Array(ab);
//        for (let i = 0; i < byteString.length; i++) {
//          ia[i] = byteString.charCodeAt(i);
//        }
//        const blob = new Blob([ab], { type: mimeString });
 
//        const formData = new FormData();
//        formData.append('image', blob, 'capture.jpg');
 
//       fetch('http://192.168.0.105:5000/upload', {
//          method: 'POST',
//          body: formData,
//        })
//          .then((response) => {
//            if (!response.ok) {
//              throw new Error('Failed to upload image.');
//            }
//            return response.json();
//          })
//          .then((data) => {
//            console.log('Image saved successfully', data);
//          })
//          .catch((error) => {
//            console.error('Error saving image:', error);
//          });
//      }
//    };
 
//    return (
//      <div className="face-recognition-container">
//        <video
//          ref={videoRef}
//          autoPlay
//          muted
//          onPlay={handleVideoOnPlay}
//          width="720"
//          height="560"
//          className="video-stream"
//        />
//        <button onClick={captureImage} className="capture-button">
//          Capture Image
//        </button>
//        <div className="captured-images-container">
//          {capturedImages.map((image, index) => (
//            <img
//              key={index}
//              src={image}
//              alt={`Captured ${index}`}
//              className="captured-image"
//            />
//          ))}
//        </div>
//      </div>
//    );
//  };
 
//  export default FaceRecognition;
 












/*
  File: FaceRecognition.jsx
  Purpose: Handles webcam video streaming, displays facial overlays (boxes, landmarks, expressions),
           allows user to capture image, download it, and upload to server.

  🔧 Key Responsibilities:
  - Start webcam stream when component mounts
  - Overlay facial detection data (boxes, landmarks, expressions) on canvas
  - Allow user to capture image of current video frame
  - Auto-download the captured image
  - Upload the image as a blob to backend server via POST request

  📦 Dependencies:
  - React: For managing state and side effects
  - face-api.js: For drawing detections and expressions
  - CSS: Styling of video, button, and captured images

  🧩 React Hooks Used:
  - useState: to manage the array of captured images
  - useEffect: to start the camera and update canvas overlays

  🔁 Logic Flow:
  1. On component mount:
     - Use getUserMedia() to access the webcam and stream to <video>.
  2. When video starts playing:
     - Attach a canvas on top of the video.
     - Match canvas size to video frame.
     - Draw detections, landmarks, and expressions on the canvas.
  3. On 'Capture Image' button click:
     - Take current video frame and draw it on a new canvas.
     - Add face overlays on the canvas.
     - Convert canvas to Data URL (base64 image string).
     - Save this image to local state and auto-download it.
     - Also, convert image to binary blob and upload to backend server.

  📤 Upload Details:
  - Converts Data URL to binary format.
  - Sends it in a FormData object using fetch API to the server URL provided by props.

  🧩 Notes:
  - canvas and image operations are all client-side
  - Image downloading and uploading are optional but both are supported
  - Parent component (App.jsx) provides `videoRef` and `detections` props

*/
import React, { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import './FaceRecognition.css';
// ✅ React hooks used: useEffect, useState

// ✅ videoRef is passed from App to access the video DOM element




const FaceRecognition = ({ videoRef, handleVideoOnPlay, detections, serverUrl }) => {
  const [capturedImages, setCapturedImages] = useState([]);

  useEffect(() => {
    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error(err));
    };
    startVideo();
  }, [videoRef]);
// 📌 useEffect starts the webcam feed when component mounts using getUserMedia()

// 📌 Second useEffect sets up a canvas overlay on the video
//    - Draws detection boxes, face landmarks, and expression indicators
//    - Updates only when 'detections' array changes

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('play', () => {
        const canvas = faceapi.createCanvasFromMedia(videoRef.current);
        videoRef.current.parentElement.append(canvas);

        const displaySize = {
          width: videoRef.current.width,
          height: videoRef.current.height,
        };
        faceapi.matchDimensions(canvas, displaySize);

        const drawDetections = () => {
          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height);
          const resized = faceapi.resizeResults(detections, displaySize);
          faceapi.draw.drawDetections(canvas, resized);
          faceapi.draw.drawFaceLandmarks(canvas, resized);
          faceapi.draw.drawFaceExpressions(canvas, resized);
        };

        if (detections.length > 0) {
          drawDetections();
        }
      });
    }
  }, [detections, videoRef]);

  const captureImage = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

// ✅ captureImage() does:
//    - Draws current frame on canvas
//    - Redraws all face overlays (landmarks, expressions)
//    - Converts canvas to image (data URL)
//    - Triggers auto-download of image
//    - Converts image to Blob & sends it via POST to server backend for saving

      if (detections.length > 0) {
        const resizedDetections = faceapi.resizeResults(detections, {
          width: canvas.width,
          height: canvas.height,
        });
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }

      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImages([...capturedImages, dataUrl]);

      // ✅ Auto download the captured image
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `face_capture_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Upload to server (optional)
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');
// ✅ JSX renders:
//    - Live video stream
//    - "Capture Image" button
//    - All previously captured images
      fetch(`${serverUrl}/upload`, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => console.log('Image saved:', data))
        .catch((err) => console.error('Upload error:', err));
    }
  };

  return (
    <div className="face-recognition-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        onPlay={handleVideoOnPlay}
        width="720"
        height="560"
        className="video-stream"
      />
      <button onClick={captureImage} className="capture-button">Capture Image</button>
      <div className="captured-images-container">
        {capturedImages.map((img, i) => (
          <img key={i} src={img} alt={`Captured ${i}`} className="captured-image" />
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;


















