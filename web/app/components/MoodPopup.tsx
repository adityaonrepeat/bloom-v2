"use client"

import { useState } from "react"
import axios from "axios"

export default function MoodPopup({name}:{name:string}){

  const [open,setOpen] = useState(true)

  const moods = [
    {emoji:"😊",tag:"happy",score:40},
    {emoji:"🙂",tag:"calm",score:30},
    {emoji:"😓",tag:"stressed",score:20},
    {emoji:"😟",tag:"anxious",score:10}
  ]

  const submit = async(mood:any)=>{

    await axios.post("/api/mood",mood)

    setOpen(false)

  }

  if(!open) return null

  return(

    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl space-y-6">

        <h2 className="text-xl font-semibold">
          How are you feeling today {name}?
        </h2>

        <div className="flex gap-6 text-3xl">

          {moods.map((m)=>(
            <button
            key={m.tag}
            onClick={()=>submit(m)}
            className="hover:scale-110 transition"
            >
              {m.emoji}
            </button>
          ))}

        </div>

      </div>

    </div>

  )
}