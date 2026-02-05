import { InvitationData } from "@/lib/types"

export default function LightTemplate({ data }: { data: InvitationData }) {
  return (
    <div className="invitation-page bg-white p-16 border border-gray-200">
      
      <p className="text-center text-xs tracking-[0.4em] text-gray-400">
        IMENA FAMILY
      </p>

      <h1 className="text-center text-5xl font-light my-8 text-gray-900">
        {data.title || "Event Invitation"}
      </h1>

      <p className="text-center mb-12 text-gray-500">
        You are invited by the Light Family
      </p>

      <div className="space-y-5 text-lg text-center text-gray-800">
        <p>{data.date} • {data.time}</p>
        <p>{data.location}</p>
      </div>

      <div className="my-12 text-center max-w-lg mx-auto text-gray-600 leading-relaxed">
        <p>{data.agenda}</p>
      </div>

      <p className="text-center mt-16 text-gray-900 font-medium">
        {data.host}
      </p>

    </div>
  )
}
