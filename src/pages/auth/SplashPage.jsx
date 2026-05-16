import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function SplashPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    // Show splash every time the app loads fresh
    // (sessionStorage clears when browser tab is closed)
    const hasSeenSplash = sessionStorage.getItem("cp_splash_shown");

    const timer = setTimeout(
      () => {
        sessionStorage.setItem("cp_splash_shown", "true");

        if (isAuthenticated && user) {
          if (user.role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/teacher/home", { replace: true });
          }
        } else {
          navigate("/signup", { replace: true });
        }
      },
      hasSeenSplash ? 0 : 2800,
    );

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, user]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-navy relative overflow-hidden">

      {/* ── BACKGROUND CIRCLES ─────────────────────────────────── */}
      <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute bottom-[-60px] left-[-60px] w-48 h-48 rounded-full bg-white/4" />
      <div className="absolute top-[35%] right-[-30px] w-28 h-28 rounded-full bg-white/3" />

      {/* ── TOP BRAND BAR ──────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand" />

      {/* ── CONTENT ────────────────────────────────────────────── */}
      <div className="flex flex-col items-center z-10 px-10 animate-fade-in gap-5">

        {/* Logo box */}
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-7 shadow-2xl border-2 border-brand">
          <img src="/logo.png" alt="Classpulse" className="w-16 h-16 object-contain" />
        </div>

        {/* App name */}
        <h1 className="font-heading text-4xl font-extrabold mb-2 tracking-tight">
          <span className="text-brand">Class</span>
          <span className="text-white">pulse</span>
        </h1>

        {/* Tagline */}
        <p className="text-white/55 text-sm text-center mb-3 italic">
          Smart Attendance, Simplified
        </p>

        {/* School badge */}
        <div className="bg-white/8 border border-white/15 rounded-full px-18 py-5 mb-26">
          <p className="text-white/70 text-base font-semibold text-center p-16">
            🏛️ G.T.C Agidingbi · Ikeja, Lagos
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 items-center mb-26">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-white/40 animate-pulse-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

      </div>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <p className="absolute bottom-8 text-white/25 text-xs">
        Classpulse · G.T.C Agidingbi · 2025
      </p>

    </div>
  )
}