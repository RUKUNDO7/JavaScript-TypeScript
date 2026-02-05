import { BirthdayData } from "@/lib/types"

export default function BoyBirthdayTemplate({ data }: { data: BirthdayData }) {
  return (
    <div className="p-8 border rounded-xl bg-blue-50">
      <h2 className="text-3xl font-bold mb-2 text-blue-700">Happy Birthday {data.to}!</h2>
      <p className="mb-4 italic text-blue-600">{data.message || "Your birthday wish here"}</p>
      <p className="text-blue-800 font-semibold">From: {data.from}</p>
    </div>
  )
}
