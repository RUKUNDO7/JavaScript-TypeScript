"use client"
import { BirthdayData } from "@/lib/types"

type Props = {
  data: BirthdayData
  setData: (data: BirthdayData) => void
}

export default function BirthdayForm({ data, setData }: Props) {
  return (
    <div className="space-y-4">
      <input
        placeholder="To"
        value={data.to}
        onChange={(e) => setData({ ...data, to: e.target.value })}
        className="w-full p-3 border rounded-lg"
      />
      <input
        placeholder="From"
        value={data.from}
        onChange={(e) => setData({ ...data, from: e.target.value })}
        className="w-full p-3 border rounded-lg"
      />
      <textarea
        placeholder="Birthday Wish"
        value={data.message}
        onChange={(e) => setData({ ...data, message: e.target.value })}
        className="w-full p-3 border rounded-lg bg-white"
      />
    </div>
  )
}
