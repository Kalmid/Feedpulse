"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function FeedbackForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Bug",
    submitterName: "",
    submitterEmail: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/feedback", form);
      if (res.data.success) {
        setMessage("Feedback submitted!");
        setForm({
          title: "",
          description: "",
          category: "Bug",
          submitterName: "",
          submitterEmail: "",
        });
      }
    } catch (err) {
      console.log(err);
      setMessage("Error submitting");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Submit Feedback</h2>
      <Link href="/dashboard" className="text-blue-600 underline mb-4 block">
        Go to Dashboard
      </Link>
      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="title" value={form.title} onChange={handleChange}
          placeholder="Title" className="w-full border p-2" required />

        <textarea name="description" value={form.description} onChange={handleChange}
          placeholder="Description" className="w-full border p-2" required />

        <select name="category" value={form.category} onChange={handleChange}
          className="w-full border p-2">
          <option>Bug</option>
          <option>Feature Request</option>
          <option>Improvement</option>
          <option>Other</option>
        </select>

        <input name="submitterName" value={form.submitterName} onChange={handleChange}
          placeholder="Your Name" className="w-full border p-2" />

        <input name="submitterEmail" value={form.submitterEmail} onChange={handleChange}
          placeholder="Your Email" className="w-full border p-2" />

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}