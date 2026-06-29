import { useState, useEffect } from 'react'
import { FiClock, FiCalendar, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import api from '../../services/api'

const FILTERS = ['Today', 'This Week', 'This Month']

const FILTER_MAP = { 'Today': 'today', 'This Week': 'week', 'This Month': 'month' }

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState('Today')
  const [sessions,     setSessions]     = useState([])
  const [summary,      setSummary]      = useState({ totalDone: 0, totalSessions: 0 })
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true)
        const filter = FILTER_MAP[activeFilter]
        const res    = await api.get(`/teacher/class/history?filter=${filter}`)
        setSessions(res.data.data.sessions || [])
        setSummary(res.data.data.summary   || { totalDone: 0, totalSessions: 0 })
      } catch (err) {
        console.error('History load error:', err)
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [activeFilter])

  function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true,
    })
  }

  function formatDate(dateStr) {
    const d   = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })
  }

  function formatDuration(mins) {
    if (!mins) return '—'
    if (mins < 60) return `${mins}m`
    return `${Math.floor(mins/60)}h ${mins%60}m`
  }

  // Group sessions by date
  const grouped = sessions.reduce((acc, s) => {
    const label = formatDate(s.startedAt)
    if (!acc[label]) acc[label] = []
    acc[label].push(s)
    return acc
  }, {})

  const totalLate = sessions.filter(s => s.durationMins !== null && s.durationMins < 30).length

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'#F1F5F9' }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg, #1E40AF, #2563EB)', padding:'20px 20px 16px', flexShrink:0 }}>
        <h1 style={{ fontFamily:'Sora, sans-serif', fontSize:20, fontWeight:700, color:'white', margin:'0 0 14px' }}>
          Class History
        </h1>
        <div style={{ display:'flex', gap:8 }}>
          {FILTERS.map(f => {
            const active = f === activeFilter
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding:'7px 16px', borderRadius:20,
                  border: active ? 'none' : '1px solid rgba(255,255,255,0.25)',
                  background: active ? 'white' : 'rgba(255,255,255,0.12)',
                  color: active ? '#2563EB' : 'rgba(255,255,255,0.8)',
                  fontSize:12, fontWeight:700, cursor:'pointer',
                  fontFamily:'DM Sans, sans-serif',
                }}
              >
                {f}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ─────────────────────────────────── */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 24px' }}>

        {/* Summary cards */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          <div style={{ background:'#ECFDF5', borderRadius:14, padding:'14px 16px', border:'1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <FiCheckCircle size={16} color="#10B981" />
              <span style={{ fontSize:11, fontWeight:700, color:'#10B981', textTransform:'uppercase', letterSpacing:'0.5px' }}>Completed</span>
            </div>
            <p style={{ fontFamily:'Sora, sans-serif', fontSize:28, fontWeight:800, color:'#10B981', margin:0 }}>
              {summary.totalDone}
            </p>
            <p style={{ fontSize:11.5, color:'#64748B', margin:'2px 0 0' }}>classes taught</p>
          </div>
          <div style={{ background:'#FEF3C7', borderRadius:14, padding:'14px 16px', border:'1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <FiAlertCircle size={16} color="#F59E0B" />
              <span style={{ fontSize:11, fontWeight:700, color:'#F59E0B', textTransform:'uppercase', letterSpacing:'0.5px' }}>Short Classes</span>
            </div>
            <p style={{ fontFamily:'Sora, sans-serif', fontSize:28, fontWeight:800, color:'#F59E0B', margin:0 }}>
              {totalLate}
            </p>
            <p style={{ fontSize:11.5, color:'#64748B', margin:'2px 0 0' }}>under 30 mins</p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'40px', color:'#94A3B8', fontSize:14 }}>
            Loading history...
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px 20px', color:'#94A3B8' }}>
            <p style={{ fontSize:32, margin:'0 0 8px' }}>📭</p>
            <p style={{ fontSize:14, fontWeight:600, color:'#64748B', margin:'0 0 4px' }}>No classes yet</p>
            <p style={{ fontSize:13, margin:0 }}>Your class history will appear here</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div style={{ display:'flex', alignItems:'center', gap:8, margin:'16px 0 10px' }}>
                <FiCalendar size={13} color="#94A3B8" />
                <span style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.8px' }}>
                  {date}
                </span>
              </div>

              {items.map((s, i) => (
                <div
                  key={i}
                  style={{ background:'white', borderRadius:14, padding:'12px 14px', marginBottom:8, border:'1px solid #E2E8F0', display:'flex', alignItems:'center', gap:12, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  <div style={{ width:40, height:40, borderRadius:10, background: s.endedAt ? '#EFF6FF' : '#FEF3C7', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <FiClock size={16} color={s.endedAt ? '#2563EB' : '#F59E0B'} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:600, color:'#0F172A', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {s.subject}
                    </p>
                    <p style={{ fontSize:11.5, color:'#64748B', margin:'2px 0 0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {s.trade} · {s.room}
                    </p>
                    <p style={{ fontSize:11, color:'#94A3B8', margin:'2px 0 0', display:'flex', alignItems:'center', gap:4 }}>
                      <FiClock size={10} />
                      {formatTime(s.startedAt)}
                      {s.endedAt && ` — ${formatTime(s.endedAt)}`}
                      {s.durationMins && ` · ${formatDuration(s.durationMins)}`}
                    </p>
                  </div>
                  <span style={{
                    fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20, flexShrink:0,
                    background: s.endedAt ? '#ECFDF5' : '#FEF3C7',
                    color:      s.endedAt ? '#10B981'  : '#F59E0B',
                  }}>
                    {s.endedAt ? '✓ Done' : '⚡ Active'}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}