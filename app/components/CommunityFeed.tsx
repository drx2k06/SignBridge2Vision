"use client"
import { useState } from "react"

export default function CommunityFeed(){

  const [posts,setPosts] = useState<string[]>([])
  const [text,setText] = useState("")

  const addPost = () => {
    if(text.trim()==="") return
    setPosts([text,...posts])
    setText("")
  }

  return(

    <div style={{marginTop:"20px"}}>

      <h2>Deaf Community</h2>

      <textarea
        placeholder="Share your idea..."
        value={text}
        onChange={(e)=>setText(e.target.value)}
        style={{
          width:"600px",
          height:"80px",
          marginTop:"10px"
        }}
      />

      <br/>

      <button
        onClick={addPost}
        style={{
          marginTop:"10px",
          padding:"8px 15px"
        }}
      >
        Post
      </button>


      <div style={{marginTop:"30px"}}>

        {posts.map((p,i)=>(
          <div
            key={i}
            style={{
              background:"#1e293b",
              padding:"15px",
              marginBottom:"10px",
              borderRadius:"8px",
              width:"600px"
            }}
          >
            {p}
          </div>
        ))}

      </div>

    </div>

  )
}