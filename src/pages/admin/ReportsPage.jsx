import { useState } from "react";
import { FiDownload, FiEye, FiFileText } from "react-icons/fi";
import { MdAssignment } from "react-icons/md";

const RECENT_REPORTS = [
  {
    name: "April_2026_Attendance.pdf",
    type: "Monthly",
    date: "May 1, 2026",
    by: "Mrs. Fatima",
    size: "245 KB",
  },
  {
    name: "Week18_Summary.pdf",
    type: "Weekly",
    date: "May 5, 2026",
    by: "Mrs. Fatima",
    size: "128 KB",
  },
  {
    name: "TCH001_Term_Report.pdf",
    type: "Teacher",
    date: "Apr 28, 2026",
    by: "Mrs. Fatima",
    size: "89 KB",
  },
  {
    name: "March_2026_Attendance.pdf",
    type: "Monthly",
    date: "Apr 1, 2026",
    by: "Mrs. Fatima",
    size: "231 KB",
  },
  {
    name: "Week15_Summary.pdf",
    type: "Weekly",
    date: "Apr 14, 2026",
    by: "Mrs. Fatima",
    size: "114 KB",
  },
];

const TYPE_COLORS = {
  Monthly: { color: "#F59E0B", bg: "#FEF3C7" },
  Weekly: { color: "#2563EB", bg: "#EFF6FF" },
  Teacher: { color: "#10B981", bg: "#ECFDF5" },
};

export default function ReportsPage() {
  const [reportType, setReportType] = useState("Monthly Attendance");
  const [dateFrom, setDateFrom] = useState("2026-05-01");
  const [dateTo, setDateTo] = useState("2026-05-31");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState(RECENT_REPORTS);
  const [toast, setToast] = useState("");

  const inp = {
    width: "100%",
    height: 44,
    borderRadius: 10,
    border: "1.5px solid #E2E8F0",
    background: "#F8FAFC",
    fontSize: 13,
    color: "#0F172A",
    padding: "0 12px",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    boxSizing: "border-box",
  };

  async function generate() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    const newReport = {
      name: `${reportType.replace(" ", "_")}_${dateFrom}.pdf`,
      type: reportType.split(" ")[0],
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      by: "Mrs. Fatima",
      size: `${Math.floor(Math.random() * 200 + 80)} KB`,
    };
    setReports((p) => [newReport, ...p]);
    setLoading(false);
    setToast(`✅ ${reportType} report generated successfully!`);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
          Attendance Reports
        </h2>
        <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
          Generate and download attendance reports for any period
        </p>
      </div>

      {/* ── GENERATE FORM ──────────────────────────────────────── */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          padding: "24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <h3
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "#0F172A",
            margin: "0 0 20px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <MdAssignment size={18} color="#2563EB" /> Generate New Report
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                color: "#64748B",
                display: "block",
                marginBottom: 5,
              }}
            >
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ ...inp, appearance: "none" }}
            >
              {[
                "Monthly Attendance",
                "Weekly Summary",
                "Daily Report",
                "Individual Teacher",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                color: "#64748B",
                display: "block",
                marginBottom: 5,
              }}
            >
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={inp}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                color: "#64748B",
                display: "block",
                marginBottom: 5,
              }}
            >
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={inp}
            />
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{
            height: 48,
            padding: "0 28px",
            borderRadius: 12,
            border: "none",
            background: loading
              ? "#93C5FD"
              : "linear-gradient(135deg, #2563EB, #1E40AF)",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "DM Sans, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="3"
                />
                <path fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <FiFileText size={15} /> Generate &amp; Preview →
            </>
          )}
        </button>
      </div>

      {/* ── RECENT REPORTS ─────────────────────────────────────── */}
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
            Recent Reports
          </h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}
          >
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {[
                  "File Name",
                  "Type",
                  "Generated",
                  "By",
                  "Size",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 20px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => {
                const tc = TYPE_COLORS[r.type] || TYPE_COLORS.Weekly;
                return (
                  <tr key={i} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "12px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <FiFileText size={14} color="#94A3B8" />
                        <span
                          style={{
                            fontSize: 13,
                            color: "#0F172A",
                            fontWeight: 500,
                          }}
                        >
                          {r.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: tc.color,
                          background: tc.bg,
                          padding: "3px 10px",
                          borderRadius: 20,
                        }}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        fontSize: 12,
                        color: "#64748B",
                      }}
                    >
                      {r.date}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        fontSize: 12,
                        color: "#64748B",
                      }}
                    >
                      {r.by}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        fontSize: 12,
                        color: "#94A3B8",
                      }}
                    >
                      {r.size}
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {[FiEye, FiDownload].map((Icon, bi) => (
                          <button
                            key={bi}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 8,
                              border: "1px solid #E2E8F0",
                              background: "white",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#64748B",
                            }}
                          >
                            <Icon size={13} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#10B981",
            color: "white",
            padding: "12px 24px",
            borderRadius: 16,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
            zIndex: 300,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
