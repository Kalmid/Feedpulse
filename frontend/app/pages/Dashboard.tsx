"use client";

import { useEffect, useState } from "react";

type Feedback = {
  _id: string;
  title: string;
  description: string;
  category?: string;
  status?: string;
  ai_summary?: string;
  ai_sentiment?: string;
  ai_priority?: string;
};

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    fetch("http://localhost:4000/api/feedback")
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // Delete
  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:4000/api/feedback/${id}`, {
      method: "DELETE",
    });

    setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));
  };

  // Update status
  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch(
      `http://localhost:4000/api/feedback/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await res.json();

    setFeedbacks((prev) =>
      prev.map((fb) => (fb._id === id ? data.data : fb))
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Feedback Dashboard</h1>

      {feedbacks.length === 0 ? (
        <p>No feedback available</p>
      ) : (
        feedbacks.map((fb) => (
          <div
            key={fb._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              margin: "10px 0",
              borderRadius: "8px",
            }}
          >
            <h3>{fb.title}</h3>
            <p>{fb.description}</p>

            <p><strong>Status:</strong> {fb.status || "New"}</p>

            {/* AI Info */}
            {fb.ai_summary && (
              <>
                <p><strong>AI Summary:</strong> {fb.ai_summary}</p>
                <p><strong>Sentiment:</strong> {fb.ai_sentiment}</p>
                <p><strong>Priority:</strong> {fb.ai_priority}</p>
              </>
            )}

            {/* Status Dropdown */}
            <select
              value={fb.status || "New"}
              onChange={(e) =>
                handleStatusChange(fb._id, e.target.value)
              }
            >
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(fb._id)}
              style={{
                marginLeft: "10px",
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}