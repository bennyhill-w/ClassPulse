import { useState, useEffect } from "react";
import { FiRefreshCw, FiCopy, FiCheck } from "react-icons/fi";
import { MdPin } from "react-icons/md";
import api from "../../services/api";

export default function PinsPage() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [copied, setCopied] = useState("");

  async function loadPins() {
    try {
      setLoading(true);
      const res = await api.get("/admin/pins");
      setPins(res.data.data.pins);
      setLastUpdate(res.data.data.date);
    } catch (err) {
      console.error("Pins load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPins();
  }, []);

  function copyPin(text, id) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  }

  function copyAll() {
    const text = pins
      .map((p) => `${p.room}: Start PIN ${p.startPin} | End PIN ${p.endPin}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied("all");
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 2px",
            }}
          >
            Daily Classroom PINs
          </h2>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
            {lastUpdate} — PINs reset automatically every morning at 7:00 AM
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={copyAll}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 40,
              padding: "0 16px",
              borderRadius: 10,
              border: "1px solid #E2E8F0",
              background: "white",
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            {copied === "all" ? (
              <FiCheck size={14} color="#10B981" />
            ) : (
              <FiCopy size={14} />
            )}
            {copied === "all" ? "Copied!" : "Copy All"}
          </button>
          <button
            onClick={loadPins}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 40,
              padding: "0 16px",
              borderRadius: 10,
              border: "none",
              background: "#2563EB",
              fontSize: 13,
              fontWeight: 700,
              color: "white",
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Info box */}
      <div
        style={{
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: 14,
          padding: "14px 18px",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <MdPin
          size={20}
          color="#2563EB"
          style={{ flexShrink: 0, marginTop: 1 }}
        />
        <div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1E40AF",
              margin: "0 0 3px",
            }}
          >
            How to use these PINs
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#3B82F6",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Share today's PINs with class captains each morning. Teachers need
            the <strong>Start PIN</strong> to begin a class and the{" "}
            <strong>End PIN</strong> to close it. PINs are room-specific and
            expire at midnight.
          </p>
        </div>
      </div>

      {/* PIN cards */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#94A3B8",
            fontSize: 14,
          }}
        >
          Loading today's PINs...
        </div>
      ) : pins.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #E2E8F0",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 32, margin: "0 0 8px" }}>🔑</p>
          <p
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#64748B",
              margin: "0 0 4px",
            }}
          >
            No PINs generated yet
          </p>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 20px" }}>
            PINs are auto-generated at 7:00 AM. Add rooms to the timetable
            first.
          </p>
          <button
            onClick={loadPins}
            style={{
              height: 42,
              padding: "0 24px",
              borderRadius: 10,
              border: "none",
              background: "#2563EB",
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            Generate Now
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {pins.map((p, i) => (
            <div
              key={p.id}
              style={{
                background: "white",
                borderRadius: 16,
                border: "1px solid #E2E8F0",
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              {/* Room header */}
              <div
                style={{
                  background: "#0F1F47",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {p.room}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.5)",
                      margin: "2px 0 0",
                    }}
                  >
                    Today's PINs
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyPin(
                      `${p.room}: Start ${p.startPin} | End ${p.endPin}`,
                      p.id,
                    )
                  }
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  {copied === p.id ? (
                    <FiCheck size={13} color="#10B981" />
                  ) : (
                    <FiCopy size={13} />
                  )}
                </button>
              </div>

              {/* PINs */}
              <div style={{ padding: "16px" }}>
                {/* Start PIN */}
                <div style={{ marginBottom: 12 }}>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#10B981",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      margin: "0 0 6px",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#10B981",
                        display: "inline-block",
                      }}
                    />
                    Start PIN
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#ECFDF5",
                      borderRadius: 10,
                      padding: "10px 14px",
                      border: "1px solid #6EE7B7",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: 28,
                        fontWeight: 800,
                        color: "#065F46",
                        letterSpacing: 8,
                      }}
                    >
                      {p.startPin}
                    </span>
                    <button
                      onClick={() => copyPin(p.startPin, `start_${p.id}`)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#10B981",
                      }}
                    >
                      {copied === `start_${p.id}` ? (
                        <FiCheck size={15} />
                      ) : (
                        <FiCopy size={15} />
                      )}
                    </button>
                  </div>
                </div>

                {/* End PIN */}
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#EF4444",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      margin: "0 0 6px",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#EF4444",
                        display: "inline-block",
                      }}
                    />
                    End PIN
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#FEF2F2",
                      borderRadius: 10,
                      padding: "10px 14px",
                      border: "1px solid #FECACA",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: 28,
                        fontWeight: 800,
                        color: "#7F1D1D",
                        letterSpacing: 8,
                      }}
                    >
                      {p.endPin}
                    </span>
                    <button
                      onClick={() => copyPin(p.endPin, `end_${p.id}`)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#EF4444",
                      }}
                    >
                      {copied === `end_${p.id}` ? (
                        <FiCheck size={15} />
                      ) : (
                        <FiCopy size={15} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
