"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Avatar from "../../components/AvatarISL"

import { useEffect, useRef, useState, use } from "react"

export default function MeetingRoom({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = use(params)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<any>(null)

  const [subtitle, setSubtitle] = useState("Waiting for speech...")
  const [animation, setAnimation] = useState("welcome")
  const [gesture, setGesture] = useState("No sign detected")

  const [signVoiceEnabled, setSignVoiceEnabled] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)

  const [gestureMode, setGestureMode] = useState(false)
  const [micOn, setMicOn] = useState(false)

  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    startCamera()
  }, [])

  /* CAMERA */

  async function startCamera() {

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    streamRef.current = stream

    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }

    startHandTracking()
  }

  function toggleCamera() {

    if (!streamRef.current) return

    const tracks = streamRef.current.getTracks()

    if (cameraOn) {

      tracks.forEach((track: any) => track.stop())

      if (videoRef.current) {
        videoRef.current.srcObject = null
      }

      setCameraOn(false)

    } else {

      startCamera()
      setCameraOn(true)

    }

  }

  /* SPEECH SYNTHESIS */

  function speak(text: string) {

    if (!signVoiceEnabled) return

    const speech = new SpeechSynthesisUtterance(text)

    speech.lang = "en-US"

    window.speechSynthesis.speak(speech)
  }

  /* SPEECH RECOGNITION */

  function startSpeech() {

    if (micOn) return

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition

    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {

      const last = event.results.length - 1
      const text = event.results[last][0].transcript.trim()

      setSubtitle(text)

      const lower = text.toLowerCase()

      if (lower.includes("hello")) setAnimation("hello")
      if (lower.includes("thank")) setAnimation("thankyou")
      if (lower.includes("welcome")) setAnimation("welcome")

    }

    recognition.start()

    recognitionRef.current = recognition

    setMicOn(true)
  }

  function stopSpeech() {

    recognitionRef.current?.stop()
    setMicOn(false)

  }

  function toggleMic() {

    if (micOn) stopSpeech()
    else startSpeech()

  }

  /* GESTURE DETECTION */

function detectGesture(landmarks: any) {

  const indexTip = landmarks[8]
  const middleTip = landmarks[12]
  const ringTip = landmarks[16]
  const pinkyTip = landmarks[20]

  const indexBase = landmarks[6]
  const middleBase = landmarks[10]
  const ringBase = landmarks[14]
  const pinkyBase = landmarks[18]

  const thumbTip = landmarks[4]
  const wrist = landmarks[0]

  const indexUp = indexTip.y < indexBase.y
  const middleUp = middleTip.y < middleBase.y
  const ringUp = ringTip.y < ringBase.y
  const pinkyUp = pinkyTip.y < pinkyBase.y

  const fingersUp = indexUp && middleUp && ringUp && pinkyUp

  // HELLO (open palm)
  if (fingersUp) {
    return "hello"
  }

  // THANK YOU (hand forward slightly)
  if (indexUp && middleUp && !ringUp && !pinkyUp) {
    return "thankyou"
  }

  // ME / MINE (thumb near chest)
  if (thumbTip.y < wrist.y && !indexUp) {
    return "me"
  }

  // SORRY (closed hand)
  if (!indexUp && !middleUp && !ringUp && !pinkyUp) {
    return "sorry"
  }

  return "unknown"
}

  /* HAND TRACKING */

  function startHandTracking() {

    const wait = setInterval(() => {

      if (!(window as any).Hands) return

      clearInterval(wait)

      const video = videoRef.current
      const canvas = document.getElementById("handCanvas") as HTMLCanvasElement
      const ctx = canvas.getContext("2d")

      const hands = new (window as any).Hands({
        locateFile: (file: any) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      })

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      })

      hands.onResults((results: any) => {

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (!gestureMode) return

        if (results.multiHandLandmarks) {

          setGesture("Hand detected")

          for (const landmarks of results.multiHandLandmarks) {

            ;(window as any).drawConnectors(
              ctx,
              landmarks,
              (window as any).HAND_CONNECTIONS
            )

            ;(window as any).drawLandmarks(ctx, landmarks)

            const g = detectGesture(landmarks)

            if (g === "hello") {

              setGesture("Hello sign detected")
              setSubtitle("Hello (from sign)")
              setAnimation("hello")
              speak("Hello")

            }

            if (g === "thankyou") {

              setGesture("Thank you sign")
              setSubtitle("Thank you")
              setAnimation("thankyou")
              speak("Thank you")

            }

            if (g === "me") {

              setGesture("Me sign")
              setSubtitle("Me")
              setAnimation("me")
              speak("Me")

            }

          }

        } else {

          setGesture("No sign detected")

        }

      })

      const camera = new (window as any).Camera(video, {
        onFrame: async () => {
          await hands.send({ image: video })
        },
        width: 420,
        height: 300,
      })

      camera.start()

    }, 500)

  }

  return (

    <div style={{ padding: "40px" }}>

      <h1>SignBridge2Vision</h1>

      <p>Meeting ID : {id}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "50px",
          marginTop: "30px",
        }}
      >

        {/* LEFT SIDE */}

        <div>

          <h3>Camera Feed</h3>

          <div style={{ position: "relative", width: "420px", height: "300px" }}>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "420px",
                height: "300px",
                borderRadius: "10px",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />

            <canvas
              id="handCanvas"
              width="420"
              height="300"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 2,
              }}
            />

          </div>

          <h3 style={{ marginTop: "10px" }}>Gesture Recognition</h3>

          <p>{gesture}</p>

          <h3 style={{ marginTop: "20px" }}>Live Subtitles</h3>

          <div
            style={{
              background: "#55c0bc",
              padding: "15px",
              borderRadius: "10px",
              width: "420px",
              fontSize: "18px",
            }}
          >
            {subtitle}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>

            <button
              onClick={toggleMic}
              style={{
                padding: "10px 18px",
                background: micOn ? "#ef4444" : "#22c55e",
                border: "none",
                borderRadius: "6px",
                color: "white",
              }}
            >
              {micOn ? "Mic OFF 🎤" : "Mic ON 🎤"}
            </button>

            <button
              onClick={() => setGestureMode(!gestureMode)}
              style={{
                padding: "10px 18px",
                background: gestureMode ? "#ef4444" : "#3b82f6",
                border: "none",
                borderRadius: "6px",
                color: "white",
              }}
            >
              {gestureMode ? "Disable Gesture ✋" : "Enable Gesture ✋"}
            </button>

            <button
              onClick={() => setSignVoiceEnabled(!signVoiceEnabled)}
              style={{
                padding: "10px 18px",
                background: signVoiceEnabled ? "#ef4444" : "#8b5cf6",
                border: "none",
                borderRadius: "6px",
                color: "white",
              }}
            >
              {signVoiceEnabled
                ? "Disable Sign → Voice 🔇"
                : "Enable Sign → Voice 🔊"}
            </button>

            <button
              onClick={toggleCamera}
              style={{
                padding: "10px 18px",
                background: cameraOn ? "#f59e0b" : "#10b981",
                border: "none",
                borderRadius: "6px",
                color: "white",
              }}
            >
              {cameraOn ? "Camera OFF 📷" : "Camera ON 📷"}
            </button>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div>

          <h3>Sign Avatar</h3>

          <div
            style={{
              width: "420px",
              height: "380px",
              background: "#1f2937",
              borderRadius: "10px",
            }}
          >

            <Canvas camera={{ position: [0, 1.8, 4], fov: 35 }}>

              <ambientLight intensity={1.2} />

              <directionalLight position={[3, 4, 3]} intensity={1.5} />

              <Avatar key={animation} animation={animation} />

              <OrbitControls enableZoom={false} />

            </Canvas>

          </div>

        </div>

      </div>

    </div>

  )

}function detectGesture(landmarks) {

  const thumbTip = landmarks[4]
  const indexTip = landmarks[8]
  const middleTip = landmarks[12]
  const ringTip = landmarks[16]
  const pinkyTip = landmarks[20]

  const thumbBase = landmarks[2]
  const indexBase = landmarks[6]
  const middleBase = landmarks[10]
  const ringBase = landmarks[14]
  const pinkyBase = landmarks[18]

  const indexUp = indexTip.y < indexBase.y
  const middleUp = middleTip.y < middleBase.y
  const ringUp = ringTip.y < ringBase.y
  const pinkyUp = pinkyTip.y < pinkyBase.y

  const thumbRight = thumbTip.x > thumbBase.x

  // HELLO ✋
  if(indexUp && middleUp && ringUp && pinkyUp){
    return "hello"
  }

  // ME / MINE 👍
  
  // THANK YOU ✌
  if(indexUp && middleUp && !ringUp){
    return "thankyou"
  }

  // SORRY ✊
  if(!indexUp && !middleUp && !ringUp && !pinkyUp){
    return "sorry"
  }

  return "unknown"
}