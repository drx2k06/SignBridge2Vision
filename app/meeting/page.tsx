"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function JoinPage(){

  const [meetingId,setMeetingId] = useState("")
  const router = useRouter()

  function joinMeeting(){
    if(meetingId){
      router.push(`/meeting/${meetingId}`)
    }
  }

  return(

    <div style={{padding:"40px"}}>

      <h2>Join AI Sign Meeting</h2>

      <input
        placeholder="Enter Meeting ID"
        value={meetingId}
        onChange={(e)=>setMeetingId(e.target.value)}
        style={{padding:"10px"}}
      />

      <br/><br/>

      <button onClick={joinMeeting}>
        Join Meeting
      </button>

    </div>
  )
}