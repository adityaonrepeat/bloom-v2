export default function JournalCard({journal}:any){

  return(

    <div className="bg-white p-4 rounded-xl shadow w-72">

      <h3 className="font-semibold">
        {journal.title}
      </h3>

      <p className="text-gray-500 text-sm mt-2">
        {journal.content.slice(0,80)}
      </p>

    </div>

  )

}