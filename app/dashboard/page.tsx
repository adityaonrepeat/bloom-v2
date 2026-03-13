import prisma from "@/lib/prisma"
import Navbar from "../components/Navbar"
import MoodPopup from "../components/MoodPopup"
import MoodChart from "../components/MoodChart"
import JournalCard from "../components/JournalCard"

export default async function Dashboard(){

  const userId = "demo-user"

  const mood = await prisma.moodLog.findMany({
    where:{userId},
    take:7
  })

  const journals = await prisma.journal.findMany({
    where:{userId},
    take:3
  })

  return(

    <div>

      <Navbar/>

      < MoodPopup name="Aisha"/>

      <div className="p-10 space-y-8">

        <div>

          <h1 className="text-3xl font-semibold">
            Hello Aisha
          </h1>

          <p className="text-gray-500">
            How are you feeling today?
          </p>

        </div>

        <div className="grid grid-cols-3 gap-6">

          <MoodChart data={mood}/>

          <div className="col-span-2 bg-white p-6 rounded-xl shadow">

            <h2 className="text-lg font-semibold">
              Today's Focus: Mindfulness
            </h2>

            <button className="mt-4 bg-green-700 text-white px-4 py-2 rounded-lg">
              Take the Quiz
            </button>

          </div>

        </div>

        <div>

          <h2 className="text-xl font-semibold mb-4">
            Journals
          </h2>

          <div className="flex gap-4">

            {journals.map((j)=>(
              <JournalCard key={j.id} journal={j}/>
            ))}

          </div>

        </div>

      </div>

    </div>

  )

}