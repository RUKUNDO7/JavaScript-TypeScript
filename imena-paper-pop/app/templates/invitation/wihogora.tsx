import { InvitationData } from "@/lib/types"

export default function WihogoraTemplate({ data }: { data: InvitationData }) {
  return (
    <div className="invitation-page bg-white p-12">
      <p className="text-center text-sm tracking-widest text-gray-500">
        IMENA FAMILY
      </p>

      <h1 className="text-center text-4xl font-bold my-6">
        {data.title || "Event Invitation"}
      </h1>

      <p className="text-center italic mb-10 text-gray-600">
        Wihogora Family warmly invites you
      </p>

      <div className="space-y-4 text-lg text-center">
        <p><strong>Date:</strong> {data.date}</p>
        <p><strong>Time:</strong> {data.time}</p>
        <p><strong>Location:</strong> {data.location}</p>
      </div>

      <div className="my-10 text-center max-w-xl mx-auto">
        <p>{data.agenda}</p>
      </div>

      <p className="text-center font-semibold mt-12">
        Hosted by {data.host}
      </p>
    </div>
  )
}
