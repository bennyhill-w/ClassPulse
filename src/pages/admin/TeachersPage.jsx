import { useState } from "react";
import { FiSearch, FiEye, FiMail, FiEdit2, FiX, FiSend } from "react-icons/fi";
import { MdPersonAdd } from "react-icons/md";

const TEACHERS = [
  {
    init: "JA",
    color: "#2563EB",
    name: "Mr. John Adeola",
    id: "TCH-001",
    trade: "Computer Crafts",
    subjects: "ICT, Basic Programming",
    status: "On Time",
    scolor: "#10B981",
    sbg: "#ECFDF5",
    activity: "2/4 done",
    rate: 93,
    email: "j.adeola@gtc.edu.ng",
    phone: "080-1234-5678",
    joined: "Jan 2019",
  },
  {
    init: "CN",
    color: "#7C3AED",
    name: "Mrs. Chioma Nwankwo",
    id: "TCH-002",
    trade: "General Subjects",
    subjects: "English Language",
    status: "On Time",
    scolor: "#10B981",
    sbg: "#ECFDF5",
    activity: "1/3 done",
    rate: 97,
    email: "c.nwankwo@gtc.edu.ng",
    phone: "080-2345-6789",
    joined: "Mar 2017",
  },
  {
    init: "EO",
    color: "#059669",
    name: "Mr. Emeka Okafor",
    id: "TCH-003",
    trade: "Electronic Works",
    subjects: "Physics, Basic Electricity",
    status: "Late",
    scolor: "#F59E0B",
    sbg: "#FEF3C7",
    activity: "Active",
    rate: 78,
    email: "e.okafor@gtc.edu.ng",
    phone: "080-3456-7890",
    joined: "Sep 2020",
  },
  {
    init: "BT",
    color: "#D97706",
    name: "Mrs. Bola Taiwo",
    id: "TCH-004",
    trade: "Garment Making",
    subjects: "Chemistry, Biology",
    status: "Absent",
    scolor: "#EF4444",
    sbg: "#FEF2F2",
    activity: "—",
    rate: 65,
    email: "b.taiwo@gtc.edu.ng",
    phone: "080-4567-8901",
    joined: "Jun 2018",
  },
  {
    init: "KA",
    color: "#DC2626",
    name: "Mr. Kunle Adeyemi",
    id: "TCH-005",
    trade: "Electrical Installation",
    subjects: "Mathematics, Economics",
    status: "On Time",
    scolor: "#10B981",
    sbg: "#ECFDF5",
    activity: "1/2 done",
    rate: 90,
    email: "k.adeyemi@gtc.edu.ng",
    phone: "080-5678-9012",
    joined: "Feb 2016",
  },
  {
    init: "FA",
    color: "#0284C7",
    name: "Mrs. Funke Adeyemi",
    id: "TCH-006",
    trade: "Bookkeeping",
    subjects: "Economics, Commerce",
    status: "On Time",
    scolor: "#10B981",
    sbg: "#ECFDF5",
    activity: "1/2 done",
    rate: 88,
    email: "f.adeyemi@gtc.edu.ng",
    phone: "080-6789-0123",
    joined: "Apr 2021",
  },
  {
    init: "OA",
    color: "#059669",
    name: "Mr. Ola Adesanya",
    id: "TCH-007",
    trade: "General Subjects",
    subjects: "English Language, Literature",
    status: "On Time",
    scolor: "#10B981",
    sbg: "#ECFDF5",
    activity: "2/3 done",
    rate: 91,
    email: "o.adesanya@gtc.edu.ng",
    phone: "080-7890-1234",
    joined: "Aug 2015",
  },
  {
    init: "TR",
    color: "#7C3AED",
    name: "Mr. Tunde Rahman",
    id: "TCH-008",
    trade: "Computer Crafts",
    subjects: "Computer Hardware, Electronics",
    status: "Late",
    scolor: "#F59E0B",
    sbg: "#FEF3C7",
    activity: "Active",
    rate: 71,
    email: "t.rahman@gtc.edu.ng",
    phone: "080-8901-2345",
    joined: "Nov 2022",
  },
  {
    init: "AB",
    color: "#0284C7",
    name: "Mr. Adewale Balogun",
    id: "TCH-009",
    trade: "Draughtsmanship",
    subjects: "Technical Drawing, AutoCAD",
    status: "On Time",
    scolor: "#10B981",
    sbg: "#ECFDF5",
    activity: "1/3 done",
    rate: 85,
    email: "a.balogun@gtc.edu.ng",
    phone: "080-9012-3456",
    joined: "May 2019",
  },
];

const FILTERS = ["All", "Present", "Late", "Absent"];
const PER_PAGE = 5;

export default function TeachersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [viewTeacher, setView] = useState(null);
  const [msgTeacher, setMsg] = useState(null);
  const [editTeacher, setEdit] = useState(null);
  const [message, setMessage] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [teachers, setTeachers] = useState(TEACHERS);
  const [editForm, setEditForm] = useState({});

  // Filter + search
  const filtered = teachers.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.trade.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All"
        ? true
        : filter === "Present"
          ? t.status === "On Time"
          : filter === "Late"
            ? t.status === "Late"
            : t.status === "Absent";
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function sendMessage() {
    if (!message.trim()) return;
    // Push to teacher notifications via localStorage
    try {
      const notifs = JSON.parse(
        localStorage.getItem("klacify_teacher_notifs") || "[]",
      );
      notifs.unshift({
        message: `📧 Message from Principal: ${message}`,
        type: "default",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      });
      localStorage.setItem("klacify_teacher_notifs", JSON.stringify(notifs));
    } catch {}
    setMsgSent(true);
    setTimeout(() => {
      setMsg(null);
      setMessage("");
      setMsgSent(false);
    }, 1500);
  }

  function saveEdit() {
    setTeachers((prev) =>
      prev.map((t) => (t.id === editTeacher.id ? { ...t, ...editForm } : t)),
    );
    setEdit(null);
    setEditForm({});
  }

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── HEADER ─────────────────────────────────────────────── */}
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
            Teachers Directory
          </h2>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
            {teachers.length} staff members · G.T.C Agidingbi
          </p>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 42,
            padding: "0 18px",
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
          <MdPersonAdd size={16} /> Add Teacher
        </button>
      </div>

      {/* ── SEARCH + FILTERS ───────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <FiSearch
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94A3B8",
            }}
            size={15}
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, ID or trade..."
            style={{ ...inp, paddingLeft: 38, height: 42 }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              style={{
                padding: "0 16px",
                height: 42,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: filter === f ? "#2563EB" : "#F1F5F9",
                color: filter === f ? "white" : "#64748B",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── TABLE ──────────────────────────────────────────────── */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}
          >
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {[
                  "Teacher",
                  "Trade / Subjects",
                  "Status",
                  "Activity",
                  "Attendance",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#94A3B8",
                      fontSize: 14,
                    }}
                  >
                    No teachers found
                  </td>
                </tr>
              ) : (
                paginated.map((t, i) => (
                  <tr key={t.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
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
                        <div>
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
                            style={{
                              fontSize: 11.5,
                              color: "#94A3B8",
                              margin: "2px 0 0",
                            }}
                          >
                            {t.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#0F172A",
                          margin: 0,
                        }}
                      >
                        {t.trade}
                      </p>
                      <p
                        style={{
                          fontSize: 11.5,
                          color: "#94A3B8",
                          margin: "2px 0 0",
                        }}
                      >
                        {t.subjects}
                      </p>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: t.scolor,
                          background: t.sbg,
                          padding: "4px 10px",
                          borderRadius: 20,
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        fontSize: 13,
                        color: "#64748B",
                      }}
                    >
                      {t.activity}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 56,
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
                              background:
                                t.rate >= 90
                                  ? "#10B981"
                                  : t.rate >= 75
                                    ? "#F59E0B"
                                    : "#EF4444",
                              borderRadius: 3,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#0F172A",
                          }}
                        >
                          {t.rate}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {[
                          {
                            icon: <FiEye size={14} />,
                            action: () => setView(t),
                            title: "View",
                          },
                          {
                            icon: <FiMail size={14} />,
                            action: () => {
                              setMsg(t);
                              setMsgSent(false);
                            },
                            title: "Message",
                          },
                          {
                            icon: <FiEdit2 size={14} />,
                            action: () => {
                              setEdit(t);
                              setEditForm({
                                name: t.name,
                                trade: t.trade,
                                subjects: t.subjects,
                                email: t.email,
                                phone: t.phone,
                              });
                            },
                            title: "Edit",
                          },
                        ].map((btn, bi) => (
                          <button
                            key={bi}
                            onClick={btn.action}
                            title={btn.title}
                            style={{
                              width: 32,
                              height: 32,
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
                            {btn.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, color: "#94A3B8" }}>
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
            {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}{" "}
            teachers
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                background: "white",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.4 : 1,
                fontFamily: "DM Sans, sans-serif",
                fontSize: 13,
              }}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "none",
                  background: page === p ? "#2563EB" : "white",
                  color: page === p ? "white" : "#64748B",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  border: page === p ? "none" : "1px solid #E2E8F0",
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                background: "white",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.4 : 1,
                fontFamily: "DM Sans, sans-serif",
                fontSize: 13,
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ══ VIEW TEACHER MODAL ═══════════════════════════════════ */}
      {viewTeacher && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            backdropFilter: "blur(4px)",
            padding: 20,
          }}
          onClick={() => setView(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: "white",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #1E40AF, #2563EB)",
                padding: "28px 24px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  background: viewTeacher.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "white",
                }}
              >
                {viewTeacher.init}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "white",
                    margin: "0 0 4px",
                  }}
                >
                  {viewTeacher.name}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.7)",
                    margin: 0,
                  }}
                >
                  {viewTeacher.id} · {viewTeacher.trade}
                </p>
              </div>
              <button
                onClick={() => setView(null)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <FiX size={16} />
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: "20px 24px 24px" }}>
              {[
                { label: "Subjects Taught", value: viewTeacher.subjects },
                { label: "Email", value: viewTeacher.email },
                { label: "Phone", value: viewTeacher.phone },
                { label: "Joined", value: viewTeacher.joined },
                { label: "Today's Status", value: viewTeacher.status },
                { label: "Attendance Rate", value: `${viewTeacher.rate}%` },
                { label: "Activity Today", value: viewTeacher.activity },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <span
                    style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: "#0F172A",
                      fontWeight: 600,
                      textAlign: "right",
                      maxWidth: "60%",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
              <button
                onClick={() => {
                  setView(null);
                  setMsg(viewTeacher);
                }}
                style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #2563EB, #1E40AF)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginTop: 16,
                  fontFamily: "DM Sans, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <FiMail size={15} /> Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MESSAGE MODAL ════════════════════════════════════════ */}
      {msgTeacher && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            backdropFilter: "blur(4px)",
            padding: 20,
          }}
          onClick={() => setMsg(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "white",
              borderRadius: 24,
              padding: "28px 24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                Message {msgTeacher.name.split(" ").slice(-1)[0]}
              </h3>
              <button
                onClick={() => setMsg(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                }}
              >
                <FiX size={18} />
              </button>
            </div>
            {msgSent ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <p
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#10B981",
                    margin: 0,
                  }}
                >
                  Message Sent!
                </p>
                <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
                  Delivered to {msgTeacher.name}'s app
                </p>
              </div>
            ) : (
              <>
                {/* Quick templates */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  {[
                    "Please start your class immediately.",
                    "You are required to submit your attendance.",
                    "Please report to the principal's office.",
                    "Reminder: Staff meeting today at 2PM.",
                  ].map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setMessage(t)}
                      style={{
                        padding: "9px 14px",
                        borderRadius: 10,
                        border: "1px solid #E2E8F0",
                        background: message === t ? "#EFF6FF" : "white",
                        color: message === t ? "#2563EB" : "#334155",
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Or type a custom message..."
                  rows={3}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: "1.5px solid #E2E8F0",
                    background: "#F8FAFC",
                    fontSize: 13,
                    color: "#0F172A",
                    padding: "10px 12px",
                    outline: "none",
                    fontFamily: "DM Sans, sans-serif",
                    resize: "none",
                    boxSizing: "border-box",
                    marginBottom: 14,
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 12,
                    border: "none",
                    background: message.trim()
                      ? "linear-gradient(135deg, #2563EB, #1E40AF)"
                      : "#E2E8F0",
                    color: message.trim() ? "white" : "#94A3B8",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: message.trim() ? "pointer" : "not-allowed",
                    fontFamily: "DM Sans, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <FiSend size={14} /> Send Message
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══ EDIT MODAL ═══════════════════════════════════════════ */}
      {editTeacher && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            backdropFilter: "blur(4px)",
            padding: 20,
          }}
          onClick={() => setEdit(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 460,
              background: "white",
              borderRadius: 24,
              padding: "28px 24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                Edit Teacher Details
              </h3>
              <button
                onClick={() => setEdit(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                }}
              >
                <FiX size={18} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                {
                  label: "Full Name",
                  key: "name",
                  placeholder: "e.g. Mr. John Adeola",
                },
                {
                  label: "Trade",
                  key: "trade",
                  placeholder: "e.g. Computer Crafts",
                },
                {
                  label: "Subjects",
                  key: "subjects",
                  placeholder: "e.g. ICT, Mathematics",
                },
                {
                  label: "Email Address",
                  key: "email",
                  placeholder: "email@gtc.edu.ng",
                },
                {
                  label: "Phone Number",
                  key: "phone",
                  placeholder: "080-XXXX-XXXX",
                },
              ].map((f) => (
                <div key={f.key}>
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
                    {f.label}
                  </label>
                  <input
                    value={editForm[f.key] || ""}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    placeholder={f.placeholder}
                    style={inp}
                  />
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  onClick={saveEdit}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #2563EB, #1E40AF)",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEdit(null)}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 12,
                    border: "1.5px solid #E2E8F0",
                    background: "white",
                    color: "#64748B",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
