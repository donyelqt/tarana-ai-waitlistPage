"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import WaitlistModal from "../components/WaitlistModal";

export default function ContactPage() {
  const [modalOpen, setModalOpen] = useState(false);
  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        alert("Message sent successfully!");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to send message.");
      }
    } catch (err) {
      alert("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onJoinWaitlistClick={() => setModalOpen(true)} />
      {modalOpen && <WaitlistModal onClose={() => setModalOpen(false)} />}
      {/* Navbar is now included above */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-0">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-12 md:gap-0 mt-16 md:mt-0">
          {/* Left Section */}
          <div className="flex-1 flex flex-col justify-center md:items-start items-center md:pl-8">
            <h1 className="text-5xl md:text-6xl font-medium text-[#1A2530] mb-6 text-left w-full">Contact Us</h1>
            <p className="text-[#5A6473] text-lg mb-10 max-w-md text-left w-full">
              Whether you&#39;re a traveler, business owner, city official, or curious supporter — we&#39;re here to answer your questions and explore meaningful partnerships.
            </p>
            <div className="flex flex-col gap-6 mb-8 w-full">
              {/* Email */}
              <div className="flex items-start gap-4">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#156FF5]">
                  {/* Mail SVG */}
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="12" fill="none"/>
                    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Zm2.28.22a.75.75 0 0 0-.53 1.41l6 4.5a.75.75 0 0 0 .9 0l6-4.5a.75.75 0 1 0-.9-1.2l-5.55 4.16-5.55-4.16a.75.75 0 0 0-.37-.11Z" fill="#fff"/>
                  </svg>
                </span>
                <div>
                  <div className="font-semibold text-[#1A2530] text-lg">E-mail</div>
                  <div className="text-[#5A6473] text-base">hello@tarana-ai.com</div>
                </div>
              </div>
              {/* Location */}
              <div className="flex items-start gap-4">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#156FF5]">
                  {/* Location SVG */}
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="12" fill="none"/>
                    <path d="M12 3a7 7 0 0 0-7 7c0 5.25 7 11 7 11s7-5.75 7-11a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" fill="#fff"/>
                  </svg>
                </span>
                <div>
                  <div className="font-semibold text-[#1A2530] text-lg">Location</div>
                  <div className="text-[#5A6473] text-base">InTTO Office, UC Legarda, Baguio City, Philippines</div>
                </div>
              </div>
            </div>
            {/* Socials */}
            <div className="mt-4 w-full">
              <div className="font-semibold text-[#1A2530] text-lg mb-3">Stay Connected</div>
              <div className="flex gap-6">
                {/* Facebook */}
                <a href="https://m.facebook.com/TaranaAI/?mibextid=wwXIfr&mibextid=wwXIfr" className="w-12 h-12 flex items-center justify-center rounded-full border border-[#156FF5] text-[#156FF5] hover:bg-[#156FF5] hover:text-white transition"  target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path d="M17 2.998h-3a5 5 0 0 0-5 5v3H6a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h3v7a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-7h2.066a1 1 0 0 0 .995-.9l.334-2a1 1 0 0 0-.995-1.1H13V7.998a1 1 0 0 1 1-1h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z" fill="currentColor"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/tarana.app?igsh=NTF3c2ZqOG12eGF6" className="w-12 h-12 flex items-center justify-center rounded-full border border-[#156FF5] text-[#156FF5] hover:bg-[#156FF5] hover:text-white transition" target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="12" fill="none"/>
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm6.5 1.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* Right Section (Form) */}
          <div className="flex-1 flex justify-center items-center">
            <form className="w-full max-w-lg bg-[#F5F8FB] rounded-4xl p-8 md:p-12 flex flex-col gap-6 shadow-none" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[#1A2530] font-semibold mb-2" htmlFor="name">Name</label>
                <input id="name" type="text" placeholder="Enter your full name" className="w-full px-4 py-3 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#156FF5] text-[#1A2530] placeholder-[#A0AEC0] text-base outline-none" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[#1A2530] font-semibold mb-2" htmlFor="email">Email Address</label>
                <input id="email" type="email" placeholder="Enter your email address" className="w-full px-4 py-3 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#156FF5] text-[#1A2530] placeholder-[#A0AEC0] text-base outline-none" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[#1A2530] font-semibold mb-2" htmlFor="subject">Subject</label>
                <input id="subject" type="text" placeholder="e.g. Partnership Inquiry, Feedback, Support" className="w-full px-4 py-3 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#156FF5] text-[#1A2530] placeholder-[#A0AEC0] text-base outline-none" value={subject} onChange={e => setSubject(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[#1A2530] font-semibold mb-2" htmlFor="message">Message</label>
                <textarea id="message" rows={5} placeholder="Type your message here..." className="w-full px-4 py-3 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#156FF5] text-[#1A2530] placeholder-[#A0AEC0] text-base outline-none resize-none" value={message} onChange={e => setMessage(e.target.value)} required />
              </div>
                <button type="submit" className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-b from-blue-700 to-blue-500 text-white font-medium text-lg shadow-none hover:opacity-90 hover:to-blue-700 transition-colors" disabled={submitting}>{submitting ? "Sending..." : "Submit"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 