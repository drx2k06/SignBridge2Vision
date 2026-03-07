export default function RootLayout({ children }) {

return (

<html lang="en">

<body>

{children}

<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"></script>

<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"></script>

<script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"></script>

</body>

</html>

)

}