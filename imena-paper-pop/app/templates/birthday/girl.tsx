import { BirthdayData } from "@/lib/types"

export default function GirlBirthdayTemplate({ data }: { data: BirthdayData }) {
  return (
    <div className="p-8 border rounded-xl bg-pink-50">
      <h2 className="text-3xl font-bold mb-2 text-pink-700">Happy Birthday {data.to}!</h2>
      <p className="mb-4 italic text-pink-600">{data.message || "Your birthday wish here"}</p>
      <p className="text-pink-800 font-semibold">From: {data.from}</p>
    </div>
  )
}
