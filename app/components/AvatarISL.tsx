'use client'

import { useGLTF, useAnimations } from "@react-three/drei"
import { useEffect, useRef } from "react"

export default function Avatar({ animation }) {

const group = useRef()

const { scene, animations } = useGLTF(`/animations/${animation}.glb`)

const { actions, names } = useAnimations(animations, group)

useEffect(() => {

if(actions && names.length>0){

actions[names[0]].reset().fadeIn(0.5).play()

}

return ()=>{

names.forEach(name=>actions[name]?.stop())

}

},[animation])

scene.position.set(0,-1.1,0)
scene.scale.set(1.2,1.2,1.2)

return(

<group ref={group}>

<primitive object={scene}/>

</group>

)

}