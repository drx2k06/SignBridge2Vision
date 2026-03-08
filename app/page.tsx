"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function MeetingJoin(){

  const router = useRouter()
  const [id,setId] = useState("")

  function joinMeeting(){
    if(!id) return
    router.push(`/meeting/${id}`)
  }

  return (

    <div style={{padding:"40px"}}>

      <h1>SignBridge2Vision</h1>

      <input
        placeholder="Enter Meeting ID"
        value={id}
        onChange={(e)=>setId(e.target.value)}
        style={{padding:"10px",marginTop:"20px"}}
      />

      <br/><br/>

      <button onClick={joinMeeting}>
        Join Meeting
      </button>

    </div>

  )
}