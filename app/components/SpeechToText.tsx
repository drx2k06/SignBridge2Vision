"use client"

import { useEffect, useState } from "react"

export default function SpeechToText({ setWord }: any) {

  const [subtitle, setSubtitle] = useState("Listening...")

  useEffect(()=>{

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition

    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event:any)=>{

      const text =
        event.results[event.results.length-1][0].transcript.toLowerCase()

      setSubtitle(text)

      if(text.includes("hello")) setWord("hello")
      if(text.includes("thank")) setWord("thank")
      if(text.includes("welcome")) setWord("welcome")
      if(text.includes("yes")) setWord("yes")

    }

    recognition.start()

  },[])

  return (

    <div
      style={{
        background:"#1e293b",
        padding:"10px",
        borderRadius:"10px"
      }}
    >

      📄 Subtitle: {subtitle}

    </div>

  )
}