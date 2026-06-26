import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPeople,
  MdPersonOff,
  MdAccessTime,
  MdClass,
  MdWarning,
  MdRefresh,
} from "react-icons/md";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import api from "../../services/api";

function StatCard({ icon: Icon, iconBg, iconColor, value, label, sub, subUp }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: "20px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={22} color={iconColor} />
        </div>
        {sub && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 600,
              color: subUp ? "#10B981" : "#EF4444",
            }}
          >
            {subUp ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />} {sub}
          </div>
        )}
      </div>
      <p
        style={{
          fontFamily: "Sora, sans-serif",
          fontSize: 36,
          fontWeight: 800,
          color: "#0F172A",
          margin: "0 0 4px",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>{label}</p>
    </div>
  );
}

const BADGE_COLORS = {
  "fb-green": { color: "#10B981", bg: "#ECFDF5" },
  "fb-blue": { color: "#2563EB", bg: "#EFF6FF" },
  "fb-orange": { color: "#F59E0B", bg: "#FEF3C7" },
  "fb-red": { color: "#EF4444", bg: "#FEF2F2" },
  "fb-purple": { color: "#7C3AED", bg: "#F5F3FF" },
};

const TEACHER_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#0284C7",
  "#D97706",
  "#0F766E",
];

function getColor(initials) {
  const idx =
    (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) %
    TEACHER_COLORS.length;
  return TEACHER_COLORS[idx];
}

export default function OverviewPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    activeClasses: 0,
    idleClasses: 0,
    totalStaff: 0,
  });
  const [feedEvents, setFeedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("Loading...");

  const loadData = useCallback(async () => {
    try {
      const [overviewRes, feedRes] = await Promise.all([
        api.get("/admin/overview"),
        api.get("/admin/feed?limit=15"),
      ]);
      setStats(overviewRes.data.data.stats);
      setFeedEvents(feedRes.data.data.events);
      setLastUpdated("just now");
    } catch (err) {
      console.error("Overview load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 300,
        }}
      >
        <p style={{ color: "#94A3B8", fontSize: 14 }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Date + Refresh */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <button
          onClick={loadData}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "#64748B",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <MdRefresh size={14} /> Updated {lastUpdated}
        </button>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard
          icon={MdPeople}
          iconBg="#ECFDF5"
          iconColor="#10B981"
          value={stats.present}
          label="Teachers Present"
          sub={`of ${stats.totalStaff} total`}
          subUp={true}
        />
        <StatCard
          icon={MdPersonOff}
          iconBg="#FEF2F2"
          iconColor="#EF4444"
          value={stats.absent}
          label="Absent Today"
          sub="not checked in"
          subUp={false}
        />
        <StatCard
          icon={MdAccessTime}
          iconBg="#FEF3C7"
          iconColor="#F59E0B"
          value={stats.late}
          label="Late Arrivals"
          sub="after 8:15 AM"
          subUp={false}
        />
        <StatCard
          icon={MdClass}
          iconBg="#EFF6FF"
          iconColor="#2563EB"
          value={stats.activeClasses}
          label="Active Classes Now"
          sub="live right now"
          subUp={true}
        />
      </div>

      {/* Idle Alert Card */}
      <div
        style={{
          background: stats.idleClasses > 0 ? "#FEF2F2" : "white",
          borderRadius: 16,
          padding: 20,
          border:
            stats.idleClasses > 0 ? "1.5px solid #FECACA" : "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: stats.idleClasses > 0 ? "#FEF2F2" : "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MdWarning
              size={22}
              color={stats.idleClasses > 0 ? "#EF4444" : "#94A3B8"}
            />
          </div>
          <div>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: stats.idleClasses > 0 ? "#EF4444" : "#94A3B8",
                margin: 0,
              }}
            >
              {stats.idleClasses}
            </p>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
              Idle / Unattended Classes
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/alerts")}
          style={{
            padding: "8px 16px",
            borderRadius: 10,
            border: "1px solid #E2E8F0",
            background: "white",
            fontSize: 12,
            fontWeight: 700,
            color: "#64748B",
            cursor: "pointer",
          }}
        >
          View Alerts
        </button>
      </div>

      {/* Bottom Grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}
      >
        {/* Live Feed */}
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
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10B981",
                  animation: "pulse 2s infinite",
                }}
              />
              <h3
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                Live Activity Feed
              </h3>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#10B981",
                background: "#ECFDF5",
                padding: "3px 10px",
                borderRadius: 20,
              }}
            >
              Real-time
            </span>
          </div>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {feedEvents.length === 0 ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#94A3B8",
                  fontSize: 13,
                }}
              >
                No activity yet today
              </div>
            ) : (
              feedEvents.map((e, i) => {
                const bc =
                  BADGE_COLORS[e.badgeClass] || BADGE_COLORS["fb-blue"];
                const col = getColor(e.teacherInitials || "AA");
                return (
                  <div
                    key={e.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 20px",
                      borderBottom: "1px solid #F8FAFC",
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: col,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {e.teacherInitials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#0F172A",
                          margin: 0,
                        }}
                      >
                        {e.teacherName}
                      </p>
                      <p
                        style={{
                          fontSize: 11.5,
                          color: "#64748B",
                          margin: "2px 0 0",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {e.detail}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: 10.5, color: "#94A3B8" }}>
                        {e.time}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: bc.color,
                          background: bc.bg,
                          padding: "2px 8px",
                          borderRadius: 20,
                        }}
                      >
                        {e.badge}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Attendance Summary */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              border: "1px solid #E2E8F0",
              padding: "16px 20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
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
                Today's Attendance
              </h3>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>
                {stats.totalStaff} staff total
              </span>
            </div>
            {[
              {
                label: "Present",
                val: stats.present,
                pct:
                  stats.totalStaff > 0
                    ? Math.round((stats.present / stats.totalStaff) * 100)
                    : 0,
                color: "#10B981",
              },
              {
                label: "Late",
                val: stats.late,
                pct:
                  stats.totalStaff > 0
                    ? Math.round((stats.late / stats.totalStaff) * 100)
                    : 0,
                color: "#F59E0B",
              },
              {
                label: "Absent",
                val: stats.absent,
                pct:
                  stats.totalStaff > 0
                    ? Math.round((stats.absent / stats.totalStaff) * 100)
                    : 0,
                color: "#EF4444",
              },
            ].map((row) => (
              <div key={row.label} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 12, color: "#64748B" }}>
                    {row.label}
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: row.color }}
                  >
                    {row.val} ({row.pct}%)
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: "#F1F5F9",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${row.pct}%`,
                      background: row.color,
                      borderRadius: 3,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            ))}
            <p style={{ fontSize: 11, color: "#94A3B8", margin: "10px 0 0" }}>
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Quick Links */}
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
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid #E2E8F0",
              }}
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
                Quick Actions
              </h3>
            </div>
            {[
              {
                label: "View All Teachers",
                path: "/admin/teachers",
                color: "#2563EB",
              },
              {
                label: "Active Classes",
                path: "/admin/classes",
                color: "#10B981",
              },
              {
                label: "Live Monitor",
                path: "/admin/monitor",
                color: "#7C3AED",
              },
              {
                label: "Generate Report",
                path: "/admin/reports",
                color: "#F59E0B",
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 20px",
                  background: "none",
                  border: "none",
                  borderBottom: i < 3 ? "1px solid #F1F5F9" : "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}
                >
                  {item.label}
                </span>
                <span style={{ fontSize: 18, color: item.color }}>›</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
