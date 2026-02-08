"use client";
import { useState } from "react";
import { InvitationData } from "../types";

interface FormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export default function InvitationForm({ data, setData }: FormProps) {
  const [dateError, setDateError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "date") {
      const today = new Date().toISOString().split("T")[0];
      if (value && value < today) {
        setDateError("Please choose today or a future date.");
        return;
      }
      setDateError(null);
    }
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const labelStyle = "text-[11px] font-semibold tracking-[0.08em] text-[#96712F] mb-2 block";
  const inputStyle = "w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm focus:border-[#96712F] outline-none transition-all placeholder:text-slate-900 placeholder:opacity-100";
  const btnClass = (active: boolean) => 
    `flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${
      active ? 'bg-[#153273] text-white border-[#153273]' : 'bg-white text-slate-400 border-slate-200'
    }`;

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Category Selection */}
      <div className="flex gap-3">
        <button 
          type="button"
          onClick={() => setData({...data, category: 'Announcements'})}
          className={btnClass(data.category === 'Announcements')}
        >Announcements</button>
        <button 
          type="button"
          onClick={() => setData({...data, category: 'Birthdays'})}
          className={btnClass(data.category === 'Birthdays')}
        >Birthdays</button>
      </div>

      {/* 2. Sub-Family Selection */}
      <div>
        <label className={labelStyle}>Select sub-family</label>
        <select 
          name="subFamily" 
          value={data.subFamily} 
          onChange={handleChange}
          className={inputStyle}
        >
          <option value="Wihogora">Wihogora</option>
          <option value="Light">Light</option>
          <option value="Hope">Hope</option>
        </select>
      </div>

      {/* 3. Event Title */}
      <div>
        <label className={labelStyle}>
          {data.category === 'Birthdays' ? "Birthday name" : "Event title"}
        </label>
        <input name="title" value={data.title} onChange={handleChange} className={inputStyle} placeholder="e.g. Amahoro's 5th Birthday" />
      </div>

      {/* 4. Conditional Slogan/Wishes */}
      <div>
        <label className={labelStyle}>
          {data.category === 'Birthdays' ? "Birthday wishes" : "Event description"}
        </label>
        <textarea 
          name="slogan" 
          value={data.slogan} 
          onChange={handleChange} 
          className={inputStyle} 
          rows={2} 
          placeholder={data.category === 'Birthdays' ? "May your year be filled with joy..." : "United in Celebration"} 
        />
      </div>

      {/* 5. Agenda */}
      <div>
        <label className={labelStyle}>Agenda</label>
        <textarea
          name="agenda"
          value={data.agenda}
          onChange={handleChange}
          className={inputStyle}
          rows={3}
          placeholder="e.g. Welcome • Speeches • Dinner • Dancing"
        />
      </div>

      {/* 5. Date & Time Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Date</label>
          <input
            name="date"
            type="date"
            value={data.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            className={inputStyle}
          />
          {dateError ? (
            <p className="mt-2 text-[11px] text-red-600">{dateError}</p>
          ) : null}
        </div>
        <div>
          <label className={labelStyle}>Time</label>
          <input name="time" type="time" value={data.time} onChange={handleChange} className={inputStyle} />
        </div>
      </div>

      {/* 6. Location */}
      <div>
        <label className={labelStyle}>Location</label>
        <input name="location" value={data.location} onChange={handleChange} className={inputStyle} placeholder="Venue Name or Address" />
      </div>

      {/* 7. Additional Notes */}
      <div>
        <label className={labelStyle}>Additional notes</label>
        <textarea 
          name="additionalNotes" 
          value={data.additionalNotes} 
          onChange={handleChange} 
          className={inputStyle} 
          rows={3} 
          placeholder="Dress code, RSVP details, etc." 
        />
      </div>
    </div>
  );
}
