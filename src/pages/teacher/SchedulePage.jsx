import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiChevronDown, FiX } from "react-icons/fi";
import api from "../../services/api";
import Toast from "../../components/ui/Toast";
import { TRADES, SUBJECTS, CLASS_YEARS } from "../../utils/constants";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getWeekDays() {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function SchedulePage() {
  const todayDow = new Date().getDay();
  const initDow = todayDow === 0 || todayDow === 6 ? 1 : todayDow;

  const [activeDow, setActiveDow] = useState(initDow);
  const [timetable, setTimetable] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmIdx, setConfirmIdx] = useState(null);

  const [form, setForm] = useState({
    selectedTrades: [],
    customTrade: "",
    showCustomTrade: false,
    selectedClassYears: [],
    subject: "",
    customSubject: "",
    showCustomSubject: false,
    start: "09:00",
    end: "10:00",
    room: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    async function loadTimetable() {
      try {
        const res = await api.get("/teacher/timetable");
        const data = res.data.data.timetable;

        // Convert backend format to frontend display format
        const converted = {};
        Object.keys(data).forEach((day) => {
          converted[day] = data[day].map((entry) => ({
            id: entry.id,
            start: entry.startTime,
            end: entry.endTime,
            sub: entry.subject,
            meta: `${entry.classYear} — ${entry.trade} · ${entry.room}`,
          }));
        });
        setTimetable(converted);
      } catch (err) {
        console.error("Failed to load timetable:", err);
      }
    }
    loadTimetable();
  }, []);

  const weekDays = getWeekDays();
  const activeDate = weekDays.find((d) => d.getDay() === activeDow);
  const classes = timetable[activeDow] || [];

  // ── FORM ───────────────────────────────────────────────────────
  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors((p) => ({ ...p, [name]: "" }));
  }

  function validateForm() {
    const errs = {};
    if (form.selectedTrades.length === 0)
      errs.trade = "Select at least one department";
    if (form.selectedClassYears.length === 0)
      errs.classYear = "Select at least one class year";
    if (!form.subject) errs.subject = "Select a subject";
    if (!form.room.trim()) errs.room = "Enter room number";
    return errs;
  }

  function fmtTime(t) {
    const [h, m] = t.split(":");
    return `${parseInt(h)}:${m}`;
  }

  async function addClass() {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      const tradeString = form.selectedTrades.join(" + ");
      const classYearString = form.selectedClassYears.join(" + ");

      const res = await api.post("/teacher/timetable", {
        dayOfWeek: activeDow,
        startTime: form.start,
        endTime: form.end,
        subject: form.subject,
        trade: tradeString,
        classYear: classYearString,
        room: form.room,
      });

      const newEntry = {
        id: res.data.data.entry.id,
        start: fmtTime(form.start),
        end: fmtTime(form.end),
        sub: form.subject,
        meta: `${classYearString} — ${tradeString} · ${form.room}`,
      };

      const updated = [...(timetable[activeDow] || []), newEntry].sort(
        (a, b) => {
          const toMins = (t) => {
            const [h, m] = t.split(":");
            return parseInt(h) * 60 + parseInt(m);
          };
          return toMins(a.start) - toMins(b.start);
        },
      );

      setTimetable((p) => ({ ...p, [activeDow]: updated }));
      setForm({
        selectedTrades: [],
        customTrade: "",
        showCustomTrade: false,
        selectedClassYears: [],
        subject: "",
        customSubject: "",
        showCustomSubject: false,
        start: "09:00",
        end: "10:00",
        room: "",
      });
      setFormErrors({});
      setShowForm(false);
      setToast({
        message: `✅ ${newEntry.sub} added to timetable!`,
        type: "success",
      });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add class";
      setToast({ message, type: "error" });
    }
  }

  async function deleteClass(idx) {
    if (confirmIdx === idx) {
      const entry = (timetable[activeDow] || [])[idx];
      const entryId = entry?.id;

      try {
        if (entryId && !entryId.startsWith("local_")) {
          await api.delete(`/teacher/timetable/${entryId}`);
        }
        const updated = [...(timetable[activeDow] || [])];
        const removed = updated.splice(idx, 1)[0];
        setTimetable((p) => ({ ...p, [activeDow]: updated }));
        setConfirmIdx(null);
        setToast({
          message: `🗑️ "${removed.sub}" removed from timetable.`,
          type: "success",
        });
      } catch (err) {
        const message = err.response?.data?.message || "Failed to delete class";
        setToast({ message, type: "error" });
        setConfirmIdx(null);
      }
    } else {
      setConfirmIdx(idx);
    }
  }

  function cancelDelete() {
    setConfirmIdx(null);
  }

  // ── FIELD STYLE ───────────────────────────────────────────────
  const fieldStyle = (error) => ({
    width: "100%",
    height: 48,
    borderRadius: 10,
    border: error ? "1.5px solid #EF4444" : "1.5px solid #E2E8F0",
    background: "#F8FAFC",
    fontSize: 13,
    color: "#0F172A",
    padding: "0 12px",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    appearance: "none",
  });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#F1F5F9",
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E40AF, #2563EB)",
          padding: "20px 20px 16px",
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: "white",
            margin: "0 0 14px",
          }}
        >
          My Schedule
        </h1>

        {/* Day chips */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {weekDays.map((d) => {
            const dow = d.getDay();
            const active = dow === activeDow;
            return (
              <button
                key={dow}
                onClick={() => {
                  setActiveDow(dow);
                  setConfirmIdx(null);
                }}
                style={{
                  flexShrink: 0,
                  padding: "7px 14px",
                  borderRadius: 20,
                  border: active ? "none" : "1px solid rgba(255,255,255,0.25)",
                  background: active ? "white" : "rgba(255,255,255,0.12)",
                  color: active ? "#2563EB" : "rgba(255,255,255,0.8)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {DAY_NAMES[dow]} {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ─────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        {/* Section header */}
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
              fontSize: 15,
              fontWeight: 700,
              color: "#0F172A",
              margin: 0,
            }}
          >
            {activeDate
              ? `${FULL_NAMES[activeDow]}, ${activeDate.getDate()} ${MONTHS[activeDate.getMonth()]}`
              : FULL_NAMES[activeDow]}
          </h3>
          <button
            onClick={() => {
              setShowForm(true);
              setConfirmIdx(null);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 34,
              padding: "0 14px",
              borderRadius: 10,
              background: "#2563EB",
              border: "none",
              color: "white",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <FiPlus size={14} /> Add Class
          </button>
        </div>

        {/* Add class form */}
        {showForm && (
          <div
            style={{
              background: "white",
              borderRadius: 18,
              padding: 20,
              marginBottom: 16,
              border: "1px solid #E2E8F0",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h4
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                Add New Class
              </h4>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormErrors({});
                }}
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

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Trade / Department - Multi Select */}
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
                  Trade / Department
                </label>

                {/* Selected chips */}
                {form.selectedTrades.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginBottom: 8,
                    }}
                  >
                    {form.selectedTrades.map((trade) => (
                      <div
                        key={trade}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          background: "#EFF6FF",
                          border: "1px solid #BFDBFE",
                          borderRadius: 20,
                          padding: "4px 10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: "#2563EB",
                            fontWeight: 600,
                          }}
                        >
                          {trade}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              selectedTrades: p.selectedTrades.filter(
                                (t) => t !== trade,
                              ),
                            }))
                          }
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#2563EB",
                            fontSize: 14,
                            lineHeight: 1,
                            padding: 0,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dropdown */}
                <div style={{ position: "relative" }}>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      if (val === "__other__") {
                        setForm((p) => ({ ...p, showCustomTrade: true }));
                      } else if (!form.selectedTrades.includes(val)) {
                        setForm((p) => ({
                          ...p,
                          selectedTrades: [...p.selectedTrades, val],
                        }));
                      }
                      e.target.value = "";
                    }}
                    style={fieldStyle(formErrors.trade)}
                  >
                    <option value="">+ Add Department</option>
                    {TRADES.filter((t) => !form.selectedTrades.includes(t)).map(
                      (t) => (
                        <option key={t}>{t}</option>
                      ),
                    )}
                    <option value="__other__">Other (type your own)</option>
                  </select>
                  <FiChevronDown
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94A3B8",
                      pointerEvents: "none",
                    }}
                    size={14}
                  />
                </div>

                {/* Custom trade input */}
                {form.showCustomTrade && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      placeholder="Type department name..."
                      value={form.customTrade}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, customTrade: e.target.value }))
                      }
                      style={{
                        flex: 1,
                        height: 44,
                        borderRadius: 10,
                        border: "1.5px solid #E2E8F0",
                        background: "#F8FAFC",
                        fontSize: 13,
                        color: "#0F172A",
                        padding: "0 12px",
                        outline: "none",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          form.customTrade.trim() &&
                          !form.selectedTrades.includes(form.customTrade.trim())
                        ) {
                          setForm((p) => ({
                            ...p,
                            selectedTrades: [
                              ...p.selectedTrades,
                              p.customTrade.trim(),
                            ],
                            customTrade: "",
                            showCustomTrade: false,
                          }));
                        }
                      }}
                      style={{
                        height: 44,
                        padding: "0 14px",
                        borderRadius: 10,
                        border: "none",
                        background: "#2563EB",
                        color: "white",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </button>
                  </div>
                )}

                {formErrors.trade && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "#EF4444",
                      margin: "4px 0 0",
                    }}
                  >
                    {formErrors.trade}
                  </p>
                )}
              </div>

              {/* Class Year - Multi Select */}
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
                  Class Year
                </label>

                {/* Selected chips */}
                {form.selectedClassYears.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginBottom: 8,
                    }}
                  >
                    {form.selectedClassYears.map((year) => (
                      <div
                        key={year}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          background: "#EFF6FF",
                          border: "1px solid #BFDBFE",
                          borderRadius: 20,
                          padding: "4px 10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: "#2563EB",
                            fontWeight: 600,
                          }}
                        >
                          {year}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              selectedClassYears: p.selectedClassYears.filter(
                                (y) => y !== year,
                              ),
                            }))
                          }
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#2563EB",
                            fontSize: 14,
                            lineHeight: 1,
                            padding: 0,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dropdown */}
                <div style={{ position: "relative" }}>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      if (!form.selectedClassYears.includes(val)) {
                        setForm((p) => ({
                          ...p,
                          selectedClassYears: [...p.selectedClassYears, val],
                        }));
                      }
                      e.target.value = "";
                    }}
                    style={fieldStyle(formErrors.classYear)}
                  >
                    <option value="">+ Add Class Year</option>
                    {CLASS_YEARS.filter(
                      (y) => !form.selectedClassYears.includes(y),
                    ).map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                  <FiChevronDown
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94A3B8",
                      pointerEvents: "none",
                    }}
                    size={14}
                  />
                </div>

                {formErrors.classYear && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "#EF4444",
                      margin: "4px 0 0",
                    }}
                  >
                    {formErrors.classYear}
                  </p>
                )}
              </div>

              {/* Subject - With custom option */}
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
                  Subject
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "__other__") {
                        setForm((p) => ({
                          ...p,
                          showCustomSubject: true,
                          subject: "",
                        }));
                      } else {
                        setForm((p) => ({
                          ...p,
                          subject: val,
                          showCustomSubject: false,
                          customSubject: "",
                        }));
                      }
                      if (formErrors.subject)
                        setFormErrors((p) => ({ ...p, subject: "" }));
                    }}
                    style={fieldStyle(formErrors.subject)}
                  >
                    <option value="">Select Subject</option>
                    {SUBJECTS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                    <option value="__other__">Other (type your own)</option>
                  </select>
                  <FiChevronDown
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94A3B8",
                      pointerEvents: "none",
                    }}
                    size={14}
                  />
                </div>

                {/* Custom subject input */}
                {form.showCustomSubject && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      placeholder="Type subject name..."
                      value={form.customSubject}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          customSubject: e.target.value,
                        }))
                      }
                      style={{
                        flex: 1,
                        height: 44,
                        borderRadius: 10,
                        border: "1.5px solid #E2E8F0",
                        background: "#F8FAFC",
                        fontSize: 13,
                        color: "#0F172A",
                        padding: "0 12px",
                        outline: "none",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (form.customSubject.trim()) {
                          setForm((p) => ({
                            ...p,
                            subject: p.customSubject.trim(),
                            customSubject: "",
                            showCustomSubject: false,
                          }));
                        }
                      }}
                      style={{
                        height: 44,
                        padding: "0 14px",
                        borderRadius: 10,
                        border: "none",
                        background: "#2563EB",
                        color: "white",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </button>
                  </div>
                )}

                {formErrors.subject && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "#EF4444",
                      margin: "4px 0 0",
                    }}
                  >
                    {formErrors.subject}
                  </p>
                )}
              </div>

              {/* Time row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
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
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="start"
                    value={form.start}
                    onChange={handleFormChange}
                    style={{ ...fieldStyle(false), padding: "0 10px" }}
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
                    End Time
                  </label>
                  <input
                    type="time"
                    name="end"
                    value={form.end}
                    onChange={handleFormChange}
                    style={{ ...fieldStyle(false), padding: "0 10px" }}
                  />
                </div>
              </div>

              {/* Room */}
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
                  Room
                </label>
                <input
                  type="text"
                  name="room"
                  value={form.room}
                  onChange={handleFormChange}
                  placeholder="e.g. Room 14 or Lab A"
                  style={fieldStyle(formErrors.room)}
                />
                {formErrors.room && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "#EF4444",
                      margin: "4px 0 0",
                    }}
                  >
                    {formErrors.room}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  onClick={addClass}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #2563EB, #1E40AF)",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Add Class
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormErrors({});
                  }}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: 12,
                    border: "1.5px solid #E2E8F0",
                    background: "white",
                    color: "#64748B",
                    fontSize: 13,
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
        )}

        {/* Classes list */}
        {classes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#94A3B8",
            }}
          >
            <p style={{ fontSize: 32, margin: "0 0 8px" }}>📭</p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                margin: "0 0 4px",
                color: "#64748B",
              }}
            >
              No classes scheduled
            </p>
            <p style={{ fontSize: 13, margin: 0 }}>
              Tap "Add Class" to add one
            </p>
          </div>
        ) : (
          classes.map((cls, idx) => {
            const isConfirming = confirmIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: isConfirming ? "#FEF2F2" : "white",
                  borderRadius: 16,
                  padding: "14px 16px",
                  marginBottom: 10,
                  border: isConfirming
                    ? "1.5px solid #FECACA"
                    : "1px solid #E2E8F0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Time */}
                  <div
                    style={{ flexShrink: 0, textAlign: "center", minWidth: 44 }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#0F172A",
                        margin: 0,
                      }}
                    >
                      {cls.start}
                    </p>
                    <div
                      style={{
                        width: 1,
                        height: 12,
                        background: "#E2E8F0",
                        margin: "3px auto",
                      }}
                    />
                    <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>
                      {cls.end}
                    </p>
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 2,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: isConfirming ? "#EF4444" : "#0F172A",
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {cls.sub}
                      </p>
                      {/* Combined class badge */}
                      {cls.meta?.includes("+") && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: 20,
                            background: "#F5F3FF",
                            color: "#7C3AED",
                            border: "1px solid #DDD6FE",
                            flexShrink: 0,
                            whiteSpace: "nowrap",
                          }}
                        >
                          COMBINED
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 11.5,
                        color: "#64748B",
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      📍 {cls.meta}
                    </p>
                  </div>
                  {/* Actions */}
                  {isConfirming ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                        flexShrink: 0,
                      }}
                    >
                      <button
                        onClick={() => deleteClass(idx)}
                        style={{
                          height: 28,
                          padding: "0 12px",
                          borderRadius: 8,
                          border: "none",
                          background: "#EF4444",
                          color: "white",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "DM Sans, sans-serif",
                        }}
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={cancelDelete}
                        style={{
                          height: 28,
                          padding: "0 12px",
                          borderRadius: 8,
                          border: "1px solid #E2E8F0",
                          background: "white",
                          color: "#64748B",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "DM Sans, sans-serif",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => deleteClass(idx)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: "none",
                        background: "#FEE2E2",
                        color: "#EF4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
