"use client"

import { useRef, useState } from "react"

export default function CameraFeed() {

  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraOn, setCameraOn] = useState(false)

  const startCamera = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      })

      if(videoRef.current){
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      setCameraOn(true)

    } catch(err){
      console.log("Camera error:", err)
    }

  }

  const stopCamera = () => {

    const stream = videoRef.current?.srcObject as MediaStream

    stream?.getTracks().forEach(track => track.stop())

    if(videoRef.current){
      videoRef.current.srcObject = null
    }

    setCameraOn(false)

  }

  return (

    <div>

      <video
        ref={videoRef}
        width="520"
        height="340"
        autoPlay
        playsInline
        style={{
          borderRadius:"10px",
          background:"black"
        }}
      />

      <br/>

      {!cameraOn ? (

        <button
          onClick={startCamera}
          style={{
            marginTop:"10px",
            background:"red",
            color:"white",
            padding:"8px 14px",
            borderRadius:"6px",
            border:"none"
          }}
        >
          Camera On
        </button>

      ) : (

        <button
          onClick={stopCamera}
          style={{
            marginTop:"10px",
            background:"gray",
            color:"white",
            padding:"8px 14px",
            borderRadius:"6px",
            border:"none"
          }}
        >
          Camera Off
        </button>

      )}

    </div>
  )
}