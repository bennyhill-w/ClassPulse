import { useState, useEffect } from "react";
import api from "../../services/api";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

const PERIODS = ["weekly", "monthly", "term"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("weekly");
  const [data, setData] = useState({
    avgCheckinTime: "—",
    punctualityRate: "—",
    avgClassesPerDay: "—",
    absenceRate: "—",
    trend: "+0%",
    dailyCheckins: [],
  });
  const [topTeachers, setTopTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await api.get(`/admin/analytics?period=${period}`);
        setData(res.data.data);
        setTopTeachers(res.data.data.topTeachers || []);
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [period]);

  const isUp = (data.trend || "+0%").startsWith("+");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
            Analytics
          </h2>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
            Performance insights for G.T.C Agidingbi teaching staff
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: "7px 16px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                background: period === p ? "#2563EB" : "#F1F5F9",
                color: period === p ? "white" : "#64748B",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── KEY METRICS ────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
          gap: 14,
        }}
      >
        {[
          {
            label: "Avg Check-in Time",
            value: data.avgCheckinTime,
            color: "#2563EB",
            bg: "#EFF6FF",
          },
          {
            label: "Punctuality Rate",
            value: data.punctualityRate,
            color: "#10B981",
            bg: "#ECFDF5",
          },
          {
            label: "Avg Classes / Day",
            value: data.avgClassesPerDay,
            color: "#F59E0B",
            bg: "#FEF3C7",
          },
          {
            label: "Absence Rate",
            value: data.absenceRate,
            color: "#EF4444",
            bg: "#FEF2F2",
          },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              background: "white",
              borderRadius: 14,
              padding: "18px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 30,
                fontWeight: 800,
                color: m.color,
                margin: "0 0 4px",
              }}
            >
              {m.value}
            </p>
            <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── TREND + CHART ──────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Weekly check-in bar chart */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #E2E8F0",
            padding: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <h3
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 20px",
            }}
          >
            Daily Check-in Count (This Week)
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 12,
              height: 140,
            }}
          >
            {(data.dailyCheckins || []).map((d) => {
              const pct = d.total > 0 ? (d.count / d.total) * 100 : 0;
              const barH = (pct / 100) * 120;
              return (
                <div
                  key={d.day}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{ fontSize: 11, fontWeight: 700, color: "#2563EB" }}
                  >
                    {d.count}
                  </span>
                  <div
                    style={{
                      width: "100%",
                      height: 120,
                      display: "flex",
                      alignItems: "flex-end",
                      background: "#F1F5F9",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: barH,
                        background:
                          pct === 100
                            ? "#10B981"
                            : pct >= 85
                              ? "#2563EB"
                              : "#F59E0B",
                        borderRadius: 8,
                        transition: "height 0.6s ease",
                      }}
                    />
                  </div>
                  <span
                    style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}
                  >
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trend card */}
        <div
          style={{
            background: isUp
              ? "linear-gradient(135deg, #059669, #10B981)"
              : "linear-gradient(135deg, #DC2626, #EF4444)",
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.7)",
              margin: "0 0 8px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Trend vs Last {period}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            {isUp ? (
              <MdTrendingUp size={40} color="white" />
            ) : (
              <MdTrendingDown size={40} color="white" />
            )}
            <span
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 52,
                fontWeight: 800,
                color: "white",
              }}
            >
              {data.trend}
            </span>
          </div>
          <p
            style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0 }}
          >
            Punctuality {isUp ? "improved" : "declined"} compared to last{" "}
            {period.toLowerCase()}
          </p>
          <div
            style={{
              marginTop: 16,
              padding: "12px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: 10,
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.9)",
                margin: 0,
              }}
            >
              Current: <strong>{data.punctualityRate}</strong> punctuality rate
              across {data.dailyCheckins?.[0]?.total || 0} teaching staff
            </p>
          </div>
        </div>
      </div>

      {/* ── TOP PERFORMERS ─────────────────────────────────────── */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{ padding: "14px 20px", borderBottom: "1px solid #E2E8F0" }}
        >
          <h3
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#0F172A",
              margin: 0,
            }}
          >
            🏆 Top Performers This {period}
          </h3>
        </div>
        {topTeachers.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 20px",
              borderBottom:
                i < TOP_TEACHERS.length - 1 ? "1px solid #F8FAFC" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: "#94A3B8",
                width: 24,
              }}
            >
              #{i + 1}
            </span>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: t.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}
            >
              {t.init}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                {t.name}
              </p>
              <p
                style={{ fontSize: 11.5, color: "#94A3B8", margin: "2px 0 0" }}
              >
                {t.streak}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 80,
                  height: 6,
                  borderRadius: 3,
                  background: "#F1F5F9",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${t.rate}%`,
                    background: "#10B981",
                    borderRadius: 3,
                  }}
                />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#10B981" }}>
                {t.rate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
