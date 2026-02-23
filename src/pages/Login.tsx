import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode } from "lucide-react";

// Deterministic 21×21 QR-like pattern (no random re-renders)
const QR_PATTERN = [
  1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,0,
  1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1,
  1,0,1,1,1,0,1,0,1,1,1,0,0,0,1,0,1,1,1,0,1,
  1,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,1,1,1,0,1,
  1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,
  1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1,
  1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,
  0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,
  1,0,1,1,0,1,1,1,1,0,1,1,0,1,1,1,0,1,0,1,1,
  0,1,1,0,1,0,0,0,1,1,1,0,1,0,0,1,1,0,1,1,0,
  1,1,0,1,1,0,1,1,0,1,0,1,1,1,0,1,1,0,1,0,1,
  0,0,0,1,0,1,0,1,1,0,1,0,0,0,1,0,0,1,1,0,0,
  1,0,1,0,1,1,1,0,0,1,1,0,1,1,0,1,1,0,1,1,1,
  0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,0,1,0,0,1,0,
  1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,0,1,0,1,0,1,
  1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,1,0,1,1,0,0,
  1,0,1,1,1,0,1,0,0,0,1,1,0,1,1,1,1,0,0,1,1,
  1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,0,1,1,0,1,0,
  1,0,1,1,1,0,1,0,1,0,1,0,0,1,1,0,0,1,1,0,1,
  1,0,0,0,0,0,1,0,0,1,1,1,0,0,0,1,0,0,1,1,0,
  1,1,1,1,1,1,1,0,1,1,0,0,1,1,1,0,1,0,1,0,1,
];

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [qrHovered, setQrHovered] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [loading, user, navigate]);

  const handleGoogle = async () => {
    setSubmitting(true);
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Green Background with QR Mockup */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#22c55e] to-[#16a34a] p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative Background Shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-12 leading-tight">
            Welcome Back to
            <br />
            Online QR Generator
          </h1>

          {/* ── IMPROVED QR CARD ── */}
          <style>{`
            @keyframes qr-scanline {
              0%   { top: 12px; opacity: 1; }
              100% { top: calc(100% - 12px); opacity: 0; }
            }
            @keyframes qr-pulse {
              0%, 100% { opacity: 0.4; transform: scale(1); }
              50%       { opacity: 1;   transform: scale(1.15); }
            }
          `}</style>

          <div
            className="relative inline-block transition-transform duration-300"
            style={{ transform: qrHovered ? "rotate(0deg) scale(1.03)" : "rotate(-2deg)" }}
            onMouseEnter={() => setQrHovered(true)}
            onMouseLeave={() => setQrHovered(false)}
          >
            {/* Outer card */}
            <div
              className="rounded-[2.5rem] p-6"
              style={{
                background: "linear-gradient(160deg, #ffffff 0%, #f0fdf4 100%)",
                boxShadow: qrHovered
                  ? "0 40px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12)"
                  : "0 24px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)",
                transition: "box-shadow 0.3s ease",
              }}
            >
              {/* Inner surface */}
              <div
                className="rounded-[2rem] p-7"
                style={{
                  background: "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
                  border: "1.5px solid rgba(0,0,0,0.06)",
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {/* QR code box */}
                <div
                  className="bg-white rounded-2xl p-5 relative overflow-hidden"
                  style={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06)",
                    border: "1.5px solid rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Scan-line on hover */}
                  {qrHovered && (
                    <div
                      className="absolute left-5 right-5 rounded-full pointer-events-none"
                      style={{
                        height: "2px",
                        background: "linear-gradient(90deg, transparent, #22c55e, transparent)",
                        boxShadow: "0 0 8px #22c55e",
                        animation: "qr-scanline 1.4s linear infinite",
                        zIndex: 10,
                      }}
                    />
                  )}

                  {/* 21×21 deterministic QR grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(21, 1fr)",
                      gap: "1.5px",
                      width: "192px",
                      height: "192px",
                    }}
                  >
                    {QR_PATTERN.map((cell, i) => (
                      <div
                        key={i}
                        style={{
                          background: cell ? "#111827" : "transparent",
                          borderRadius: cell ? "2px" : "0",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Decorative dots */}
                <div className="flex justify-between mt-3 px-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "8px",
                        color: "#bbf7d0",
                        animation: `qr-pulse ${1.5 + i * 0.3}s ease-in-out infinite`,
                        display: "inline-block",
                      }}
                    >
                      ◆
                    </span>
                  ))}
                </div>

                {/* Text */}
                <div className="text-center mt-4">
                  <p className="text-gray-800 font-bold text-lg" style={{ letterSpacing: "0.01em" }}>
                    A QR Code for Every Need
                  </p>
                  <p
                    className="text-gray-400 mt-1"
                    style={{ fontSize: "0.68rem", letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "monospace" }}
                  >
                    Scan · Share · Connect
                  </p>
                </div>
              </div>
            </div>

            {/* Green badge pill */}
            <div
              className="absolute text-white font-extrabold"
              style={{
                top: "-10px",
                right: "24px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                padding: "4px 14px",
                borderRadius: "20px",
                textTransform: "uppercase",
                boxShadow: "0 4px 12px rgba(34,197,94,0.45)",
              }}
            >
              QR
            </div>

            {/* Soft glow blobs */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none" />
          </div>
          {/* Card ground shadow */}
          <div
            className="mx-auto -mt-2 rounded-full"
            style={{
              width: "60%",
              height: "16px",
              background: "rgba(0,0,0,0.12)",
              filter: "blur(10px)",
            }}
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-2xl flex items-center justify-center shadow-lg">
              <QrCode className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Login Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Log in to Online QR Generator
            </h2>
            <p className="text-gray-600 text-sm">
              Use your email to access your account
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <Input
                  type="email"
                  placeholder="Enter your email here"
                  className="pl-10 h-12 border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]"
                  disabled
                />
              </div>
            </div>

            {/* Log In Button */}
            <Button
              className="w-full h-12 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
              disabled
            >
              Log In
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button
              onClick={handleGoogle}
              disabled={submitting || loading}
              variant="outline"
              className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium text-base transition-all"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Log in with Google</span>
                </div>
              )}
            </Button>

            {/* Sign Up Link */}
          </div>
        </div>
      </div>
    </div>
  );
}


