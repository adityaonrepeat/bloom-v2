import prisma from "@/lib/prisma"
import Navbar from "../components/Navbar"
import JournalCard from "../components/JournalCard"


export default async function Journal(){

  const userId="demo-user"

  const journals = await prisma.journal.findMany({
    where:{userId}
  })

  return(

    <div>

      <Navbar/>

      <div className="p-10">

        <h1 className="text-2xl font-semibold mb-6">
          Your Journals
        </h1>

        <div className="grid grid-cols-3 gap-6">

          {journals.map((j)=>(
            <JournalCard key={j.id} journal={j}/>
          ))}

        </div>

      </div>

    </div>

  )
}