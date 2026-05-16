import { useState } from 'react'
import { FiSave } from 'react-icons/fi'
import { MdSchool, MdAccessTime, MdNotifications, MdSecurity } from 'react-icons/md'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    schoolName:    'Government Technical College (G.T.C) Agidingbi',
    schoolAddress: 'Agidingbi, Ikeja, Lagos State',
    principalName: 'Mrs. Fatima Yusuf',
    startTime:     '08:00',
    lateThreshold: '15',
    idleThreshold: '15',
    notifyIdle:    true,
    notifyLate:    true,
    notifyAbsent:  true,
    autoReports:   false,
    twoFactor:     false,
    sessionTimeout:'8',
  })
  const [toast, setToast] = useState('')

  function handleChange(key, value) {
    setSettings(p => ({ ...p, [key]: value }))
  }

  function save() {
    setToast('✅ Settings saved successfully')
    setTimeout(() => setToast(''), 2500)
  }

  const inp = { width:'100%', height:44, borderRadius:10, border:'1.5px solid #E2E8F0', background:'#F8FAFC', fontSize:13, color:'#0F172A', padding:'0 12px', outline:'none', fontFamily:'DM Sans, sans-serif', boxSizing:'border-box' }

  function Section({ icon:Icon, title, children }) {
    return (
      <div style={{ background:'white', borderRadius:16, border:'1px solid #E2E8F0', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon size={18} color="#2563EB" />
          </div>
          <h3 style={{ fontFamily:'Sora, sans-serif', fontSize:14, fontWeight:700, color:'#0F172A', margin:0 }}>{title}</h3>
        </div>
        <div style={{ padding:'20px' }}>{children}</div>
      </div>
    )
  }

  function Field({ label, hint, children }) {
    return (
      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', color:'#64748B', display:'block', marginBottom:5 }}>{label}</label>
        {children}
        {hint && <p style={{ fontSize:11, color:'#94A3B8', margin:'4px 0 0' }}>{hint}</p>}
      </div>
    )
  }

  function Toggle({ value, onChange }) {
    return (
      <button
        onClick={() => onChange(!value)}
        style={{ width:44, height:24, borderRadius:12, border:'none', background: value ? '#2563EB' : '#E2E8F0', cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}
      >
        <div style={{ width:18, height:18, borderRadius:'50%', background:'white', position:'absolute', top:3, left: value ? 23:3, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
      </button>
    )
  }

  function ToggleRow({ label, desc, setting }) {
    return (
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #F1F5F9' }}>
        <div>
          <p style={{ fontSize:13, fontWeight:600, color:'#0F172A', margin:0 }}>{label}</p>
          <p style={{ fontSize:11.5, color:'#94A3B8', margin:'2px 0 0' }}>{desc}</p>
        </div>
        <Toggle value={settings[setting]} onChange={v => handleChange(setting, v)} />
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:720 }}>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h2 style={{ fontFamily:'Sora, sans-serif', fontSize:18, fontWeight:700, color:'#0F172A', margin:'0 0 2px' }}>Settings</h2>
          <p style={{ fontSize:13, color:'#94A3B8', margin:0 }}>Configure Classpulse for G.T.C Agidingbi</p>
        </div>
        <button onClick={save} style={{ display:'flex', alignItems:'center', gap:8, height:42, padding:'0 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg, #2563EB, #1E40AF)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>
          <FiSave size={14}/> Save Changes
        </button>
      </div>

      <Section icon={MdSchool} title="School Information">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Field label="School Name">
            <input value={settings.schoolName} onChange={e => handleChange('schoolName', e.target.value)} style={inp} />
          </Field>
          <Field label="Principal Name">
            <input value={settings.principalName} onChange={e => handleChange('principalName', e.target.value)} style={inp} />
          </Field>
          <Field label="School Address" >
            <input value={settings.schoolAddress} onChange={e => handleChange('schoolAddress', e.target.value)} style={{ ...inp, gridColumn:'span 2' }} />
          </Field>
        </div>
      </Section>

      <Section icon={MdAccessTime} title="Attendance Rules">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
          <Field label="School Start Time" hint="Official start time for staff">
            <input type="time" value={settings.startTime} onChange={e => handleChange('startTime', e.target.value)} style={inp} />
          </Field>
          <Field label="Late Threshold (mins)" hint="Minutes after start before marked late">
            <input type="number" min="0" max="60" value={settings.lateThreshold} onChange={e => handleChange('lateThreshold', e.target.value)} style={inp} />
          </Field>
          <Field label="Idle Class Threshold (mins)" hint="Minutes before a class is flagged idle">
            <input type="number" min="5" max="30" value={settings.idleThreshold} onChange={e => handleChange('idleThreshold', e.target.value)} style={inp} />
          </Field>
        </div>
      </Section>

      <Section icon={MdNotifications} title="Notification Preferences">
        <ToggleRow label="Idle Class Alerts"    desc="Notify when a class is unattended past the threshold"   setting="notifyIdle"   />
        <ToggleRow label="Late Arrival Alerts"  desc="Notify when a teacher checks in after the start time"   setting="notifyLate"   />
        <ToggleRow label="Absent Teacher Alerts" desc="Notify when a teacher has not checked in by 9:00 AM"   setting="notifyAbsent" />
        <ToggleRow label="Automated Reports"    desc="Generate monthly reports automatically on last school day" setting="autoReports" />
      </Section>

      <Section icon={MdSecurity} title="Security">
        <ToggleRow label="Two-Factor Authentication" desc="Require OTP verification on login for admin account" setting="twoFactor" />
        <div style={{ padding:'12px 0' }}>
          <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', color:'#64748B', display:'block', marginBottom:5 }}>Session Timeout (hours)</label>
          <input type="number" min="1" max="24" value={settings.sessionTimeout} onChange={e => handleChange('sessionTimeout', e.target.value)} style={{ ...inp, width:120 }} />
          <p style={{ fontSize:11, color:'#94A3B8', margin:'4px 0 0' }}>Auto sign-out after this many hours of inactivity</p>
        </div>
      </Section>

      {toast && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#10B981', color:'white', padding:'12px 24px', borderRadius:16, fontSize:13, fontWeight:700, boxShadow:'0 4px 20px rgba(16,185,129,0.4)', zIndex:300 }}>
          {toast}
        </div>
      )}
    </div>
  )
}