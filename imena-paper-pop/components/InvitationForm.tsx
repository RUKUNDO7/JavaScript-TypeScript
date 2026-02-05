"use client"
import { InvitationData } from "@/lib/types"

type Props = {
  data: InvitationData
  setData: (data: InvitationData) => void
}

const fields: { key: keyof InvitationData; label: string }[] = [
  { key: "title", label: "Event Title" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "location", label: "Location" },
  { key: "agenda", label: "Agenda / Description" },
  { key: "host", label: "Host / Organizer" },
]

export default function InvitationForm({ data, setData }: Props) {
  return (
    <div className="space-y-4">
      {fields.map(({ key, label }) => (
        <input
          key={key}
          placeholder={label}
          value={data[key] ?? ""}
          onChange={(e) =>
            setData({ ...data, [key]: e.target.value })
          }
          className="w-full p-3 border rounded-lg"
        />
      ))}
    </div>
  )
}
