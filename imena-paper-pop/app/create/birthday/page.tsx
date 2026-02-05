"use client"

import { useState } from "react"
import BirthdayForm from "@/components/BirthdayForm"
import GirlBirthdayTemplate from "@/app/templates/birthday/girl"
import BoyBirthdayTemplate from "@/app/templates/birthday/boy"
import { BirthdayData } from "@/lib/types"

export default function CreateBirthday() {
  const [data, setData] = useState<BirthdayData>({
    to: "",
    from: "",
    message: "",
  })

  const [selectedTemplate, setSelectedTemplate] = useState("girl")

  const renderTemplate = () => {
    return selectedTemplate === "girl" ? (
      <GirlBirthdayTemplate data={data} />
    ) : (
      <BoyBirthdayTemplate data={data} />
    )
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2 gap-6 p-6">
      <div className="space-y-4">
        <BirthdayForm data={data} setData={setData} />

        <select
          className="p-2 border rounded-lg w-full"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <option value="girl">Birthday Girl</option>
          <option value="boy">Birthday Boy</option>
        </select>
      </div>

      <div className="bg-gray-100 p-4 rounded-xl print-area">
        {renderTemplate()}

        <button
          onClick={() => window.print()}
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
        >
          Download PDF
        </button>
      </div>
    </main>
  )
}
