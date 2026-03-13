"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts"

export default function MoodChart({data}:any){

  return(

    <div className="bg-green-900 p-6 rounded-xl text-white">

      <h3 className="mb-4">Mood Trend</h3>

      <AreaChart width={300} height={200} data={data}>

        <XAxis dataKey="date"/>

        <YAxis/>

        <Tooltip/>

        <Area
        type="monotone"
        dataKey="emotionScore"
        stroke="#fff"
        fill="#ffffff50"
        />

      </AreaChart>

    </div>

  )
}