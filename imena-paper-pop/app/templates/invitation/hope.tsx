import { InvitationData } from "@/lib/types"

export default function HopeTemplate({ data }: { data: InvitationData }) {
  return (
    <div className="invitation-page bg-green-50 p-12 border-4 border-green-200">
      
      <p className="text-center text-sm tracking-widest text-green-700">
        IMENA FAMILY
      </p>

      <h1 className="text-center text-4xl font-bold my-6 text-green-800">
        {data.title || "Event Invitation"}
      </h1>

      <p className="text-center italic mb-10 text-green-700">
        The Hope Family joyfully invites you
      </p>

      <div className="space-y-4 text-lg text-center text-green-900">
        <p><strong>Date:</strong> {data.date}</p>
        <p><strong>Time:</strong> {data.time}</p>
        <p><strong>Location:</strong> {data.location}</p>
      </div>

      <div className="my-10 text-center max-w-xl mx-auto text-green-900">
        <p>{data.agenda}</p>
      </div>

      <p className="text-center font-semibold mt-12 text-green-800">
        Hosted with love by {data.host}
      </p>

    </div>
  )
}
