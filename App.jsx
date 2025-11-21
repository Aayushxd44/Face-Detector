
// import React, { useEffect, useRef, useState } from 'react';
// import * as faceapi from 'face-api.js';
// import FaceRecognition from './Components/FaceRecognition';
// import './App.css';

// function App() {
//   const videoRef = useRef(null);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [detections, setDetections] = useState([]);

//   useEffect(() => {
//     // Load face-api.js models
//     const loadModels = async () => {
//      const MODEL_URL = '/models';
//       await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//       await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
//       await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
//       await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
//       setModelsLoaded(true);
//     };

//     loadModels();
//   }, []);

//   const handleVideoOnPlay = () => {
//     setInterval(async () => {
//       if (videoRef.current) {
//         const detections = await faceapi.detectAllFaces(
//           videoRef.current,
//           new faceapi.TinyFaceDetectorOptions()
//         ).withFaceLandmarks().withFaceExpressions();

//         setDetections(detections);
//       }
//     }, 100);
//   };

//   return (
//     <div className="App">
//       <h1>Face Detection and Recognition App</h1>
//       {modelsLoaded ? (
//         <FaceRecognition
//           videoRef={videoRef}
//           handleVideoOnPlay={handleVideoOnPlay}
//           detections={detections}
//         />
//       ) : (
//         <p>Loading models... Please Wait</p>
//       )}
//     </div>
//   );
// }

// export default App;
 




















 
/*
  File: App.jsx
  Purpose: Acts as the main application component that initializes the face detection process,
           loads the necessary face-api.js models, manages detections and expressions, 
           and passes these as props to the FaceRecognition component.

  🔧 Key Responsibilities:
  - Load face detection models on mount using face-api.js
  - Manage webcam reference via useRef
  - Detect face, landmarks, and expressions in real-time
  - Track the most likely expression (happy, sad, etc.)
  - Render video interface and expression result

  📦 Dependencies:
  - React: For UI and lifecycle handling
  - face-api.js: For face and expression detection

  🧩 React Hooks Used:
  - useState: to track model loading, detections, and expression state
  - useEffect: to run model loading once when the component mounts
  - useRef: to reference the <video> DOM element

  🧠 Logic:
  1. Load models from /models folder once (on mount).
  2. When the video starts playing, run detection every 100ms.
  3. For every detected face:
     - Get face landmarks
     - Get expressions (e.g., happy, angry)
     - Identify the expression with the highest confidence score
     - Update the UI with this expression

  📤 Props Passed to FaceRecognition:
  - videoRef: DOM ref to video element
  - handleVideoOnPlay: function that runs detection loop
  - detections: all face detection results
  - serverUrl: API endpoint to upload images to

*/





import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import FaceRecognition from './Components/FaceRecognition';
import './App.css';
// ✅ React hooks: useState, useEffect, useRef for managing video & detection state
// ✅ face-api.js for face detection, landmarks, and expression analysis

// 📌 useRef is used to reference the <video> element
// 📌 useState manages:
//    - modelsLoaded: whether models are loaded
//    - detections: face detection data
//    - expression: most likely facial expression






function App() {
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detections, setDetections] = useState([]);
  const [expression, setExpression] = useState('');

  useEffect(() => {
    // ✅ useEffect loads 4 face-api.js models from /models folder when the app mounts
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (videoRef.current) {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

// ✅ handleVideoOnPlay() runs every 100ms:
//    - Detects all faces in the video using TinyFaceDetector
//    - Adds landmarks and expressions
//    - Updates the detection state
//    - Calculates the most probable expression and updates the expression state
        setDetections(detections);

        if (detections.length > 0 && detections[0].expressions) {
          const expr = detections[0].expressions;
          const maxExpr = Object.keys(expr).reduce((a, b) => (expr[a] > expr[b] ? a : b));
          setExpression(maxExpr);
        }
      }
    }, 100);
  };

  return (
    <div className="App">
      <h1>Face Detection and Expression Recognition </h1>
  {/* // ✅ JSX renders:
//    - Heading
//    - Expression result (if any)
//    - FaceRecognition component (video + capture button + canvas)
 */}
      {modelsLoaded ? (
        <>
          <FaceRecognition
            videoRef={videoRef}
            handleVideoOnPlay={handleVideoOnPlay}
            detections={detections}
            serverUrl={'http://localhost:5000'}
          />
          <p className="expression-text">Expression: {expression}</p>
        </>
      ) : (
        <p>Loading models... Click on Capture to Download Image !! </p>
        
       
      )}
    </div>

  );
}

export default App;
 








 