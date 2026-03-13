"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {

  const path = usePathname()

  const nav = [
    { name: "Home", href: "/dashboard" },
    { name: "Journal", href: "/journal" },
    { name: "Talk", href: "/talk" },
    { name: "Quiz", href: "/quiz" },
    { name: "Aastha", href: "/aastha" }
  ]

  return (

    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-10">

      <div className="text-xl font-semibold">
        Bloom 🌿
      </div>

      <div className="flex gap-8">

        {nav.map((item)=>(
          <Link
          key={item.name}
          href={item.href}
          className={`${
            path === item.href
            ? "text-green-700 font-medium"
            : "text-gray-500"
          }`}
          >
            {item.name}
          </Link>
        ))}

      </div>

      <div className="flex items-center gap-4">

        <div className="w-8 h-8 rounded-full bg-gray-200"/>

      </div>

    </div>

  )
}