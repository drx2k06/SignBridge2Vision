"use client"

import CameraFeed from "./CameraFeed"
import AvatarISL from "./AvatarISL"
import SpeechToText from "./SpeechToText"

export default function MeetingRoom({ word, setWord }: any) {

  return (

    <div>

      <div
        style={{
          display:"flex",
          gap:"30px",
          alignItems:"center"
        }}
      >

        <CameraFeed />

        <AvatarISL word={word} />

      </div>

      <div style={{marginTop:"20px"}}>

        <SpeechToText setWord={setWord} />

      </div>

    </div>

  )
}