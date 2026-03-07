"use client"

import { useEffect, useRef, useState } from "react"

export default function SignToText(){

const videoRef = useRef<HTMLVideoElement>(null)

const [text,setText] = useState("Waiting for sign...")

const lastWord = useRef("")

function speak(word:string){

if(lastWord.current === word) return

const speech = new SpeechSynthesisUtterance(word)

speech.lang = "en-US"

window.speechSynthesis.speak(speech)

lastWord.current = word

}

useEffect(()=>{

let hands:any

const startCamera = async()=>{

const stream = await navigator.mediaDevices.getUserMedia({video:true})

if(videoRef.current){

videoRef.current.srcObject = stream

}

}

const loadMediaPipe = ()=>{

const script = document.createElement("script")

script.src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"

script.async=true

script.onload=initHands

document.body.appendChild(script)

}

const initHands = ()=>{

// @ts-ignore
hands = new window.Hands({

locateFile:(file:string)=>{
return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
}

})

hands.setOptions({

maxNumHands:1,
modelComplexity:1,
minDetectionConfidence:0.7,
minTrackingConfidence:0.7

})

hands.onResults(onResults)

detectLoop()

}

const onResults=(results:any)=>{

if(!results.multiHandLandmarks){

setText("Waiting for sign...")
return

}

const hand = results.multiHandLandmarks[0]

const thumbTip = hand[4]
const indexTip = hand[8]
const middleTip = hand[12]
const ringTip = hand[16]
const pinkyTip = hand[20]

const indexBase = hand[6]
const middleBase = hand[10]
const ringBase = hand[14]
const pinkyBase = hand[18]

/* HELLO (open palm) */

if(
indexTip.y < indexBase.y &&
middleTip.y < middleBase.y &&
ringTip.y < ringBase.y &&
pinkyTip.y < pinkyBase.y
){

setText("Hello")
speak("Hello")
return

}

/* YES (thumb up) */

if(
thumbTip.y < indexTip.y &&
indexTip.y > indexBase.y
){

setText("Yes")
speak("Yes")
return

}

/* NO (thumb down) */

if(
thumbTip.y > indexTip.y &&
indexTip.y > indexBase.y
){

setText("No")
speak("No")
return

}

/* THANK YOU */

if(
Math.abs(indexTip.x-middleTip.x) < 0.03 &&
Math.abs(middleTip.x-ringTip.x) < 0.03
){

setText("Thank You")
speak("Thank You")
return

}

}

const detectLoop = async()=>{

if(videoRef.current && hands){

await hands.send({image:videoRef.current})

}

requestAnimationFrame(detectLoop)

}

startCamera()
loadMediaPipe()

},[])

return(

<div style={{marginTop:"30px"}}>

<h2>Sign → Text → Speech</h2>

<video
ref={videoRef}
autoPlay
playsInline
style={{
width:"450px",
borderRadius:"12px"
}}
/>

<h3 style={{marginTop:"20px"}}>

Detected Text: {text}

</h3>

</div>

)

}