import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">

      {/* HERO */}
      <section className="text-center py-24 px-6 max-w-4xl mx-auto">
        <p className="tracking-widest text-sm text-gray-500 mb-3">
          IMENA FAMILY
        </p>

        <h1 className="text-6xl font-bold mb-6">
          Imena Paper Pop
        </h1>

        <p className="text-xl text-gray-600 mb-10">
          Create beautiful, branded invitations and birthday wishes in seconds.
          Fill a form, preview live, download as PDF.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            href="/create/invitation"
            className="px-8 py-4 bg-black text-white rounded-xl text-lg"
          >
            Create Invitation
          </Link>

          <Link
            href="/create/birthday"
            className="px-8 py-4 border border-black rounded-xl text-lg"
          >
            Birthday Wishes
          </Link>
        </div>
      </section>

      {/* TEMPLATE SHOWCASE */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Choose Your Template
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-semibold mb-4">Wihogora</h3>
            <p className="text-gray-600">
              Classic and formal invitation design for official family events.
            </p>
          </div>

          <div className="bg-green-50 p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-semibold mb-4 text-green-800">Hope</h3>
            <p className="text-green-900">
              Warm and friendly invitation for community gatherings.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center border">
            <h3 className="text-2xl font-semibold mb-4">Light</h3>
            <p className="text-gray-600">
              Modern and minimal invitation for stylish events.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          How It Works
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">

          <div>
            <div className="text-5xl mb-4">1️⃣</div>
            <h3 className="text-xl font-semibold mb-2">Fill the Form</h3>
            <p className="text-gray-600">
              Enter your event or birthday details in seconds.
            </p>
          </div>

          <div>
            <div className="text-5xl mb-4">2️⃣</div>
            <h3 className="text-xl font-semibold mb-2">Preview Live</h3>
            <p className="text-gray-600">
              Instantly see a polished invitation appear.
            </p>
          </div>

          <div>
            <div className="text-5xl mb-4">3️⃣</div>
            <h3 className="text-xl font-semibold mb-2">Download & Share</h3>
            <p className="text-gray-600">
              Export as PDF and share with anyone.
            </p>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-24 px-6">
        <h2 className="text-4xl font-bold mb-6">
          Ready to create your invitation?
        </h2>

        <Link
          href="/create/invitation"
          className="px-10 py-5 bg-black text-white rounded-xl text-xl"
        >
          Start Creating Now
        </Link>
      </section>

    </main>
  )
}
