"use client"

import { useState } from "react"
import InvitationForm from "@/components/InvitationForm"
import WihogoraTemplate from "@/app/templates/invitation/wihogora"
import HopeTemplate from "@/app/templates/invitation/hope"
import LightTemplate from "@/app/templates/invitation/light"
import { InvitationData } from "@/lib/types"

export default function CreateInvitation() {
  const [data, setData] = useState<InvitationData>({
    title: "",
    date: "",
    time: "",
    location: "",
    agenda: "",
    host: "",
  })

  const [selectedTemplate, setSelectedTemplate] = useState("wihogora")

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "wihogora":
        return <WihogoraTemplate data={data} />
      case "hope":
        return <HopeTemplate data={data} />
      case "light":
        return <LightTemplate data={data} />
      default:
        return <WihogoraTemplate data={data} />
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2 gap-6 p-6">
      {/* Form + template selector */}
      <div className="space-y-4">
        <InvitationForm data={data} setData={setData} />

        <select
          className="p-2 border rounded-lg w-full"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <option value="wihogora">Wihogora Family</option>
          <option value="hope">Hope Family</option>
          <option value="light">Light Family</option>
        </select>
      </div>

      {/* Preview + Download */}
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
