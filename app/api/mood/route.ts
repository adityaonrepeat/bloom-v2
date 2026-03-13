import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

  const body = await req.json()

  const userId = "demo-user"

  await prisma.user.update({

    where:{id:userId},

    data:{
      emotionalTag:body.tag,
      emotionalScore:body.score
    }

  })

  await prisma.moodLog.create({

    data:{
      userId,
      emotionTag:body.tag,
      emotionScore:body.score
    }

  })

  return NextResponse.json({success:true})

}