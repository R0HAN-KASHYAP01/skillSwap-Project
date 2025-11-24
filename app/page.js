"use client";

import { useRef, useState } from "react";
import Galaxy from "./components/Galaxy";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HomePage() {
  const signupRef = useRef(null);
  const aboutRef = useRef(null);
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollToSignup = () =>
    signupRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToAbout = () =>
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSignUp = async () => {
    try {
      setLoading(true);
      if (!fullName || !username || !email || !password) {
        toast.error("All fields except phone are required.");
        return;
      }

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          username,
          email,
          mobile: phone,
          password,
        }),
      });

      const result = await res.json();
      if (result.error) {
        toast.error(result.error);
        return;
      }

      localStorage.setItem("swapp_user", JSON.stringify(result.user));
      toast.success("Account created successfully!");
      router.push("/profile");
    } catch (err) {
      toast.error("Signup failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      if (!username || !password) {
        toast.error("Username and password required.");
        return;
      }

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: username, password }),
      });

      const result = await res.json();
      if (result.error) {
        toast.error(result.error);
        return;
      }

      localStorage.setItem("swapp_user", JSON.stringify(result.user));
      toast.success("Logged in successfully!");
      router.push("/profile");
    } catch (err) {
      toast.error("Login failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#1E1F22] text-white overflow-x-hidden">
      <ToastContainer position="top-right" theme="dark" style={{ zIndex: 999999 }} />
      <Galaxy className="absolute inset-0 z-0" />

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">SkillSwap</h1>
        <p className="max-w-2xl text-lg md:text-2xl text-white/75 mb-12">
          A next-gen platform to share, learn, and grow skills with others.
        </p>
        <div className="flex gap-6">
          <button
            onClick={scrollToSignup}
            className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition"
          >
            Get Started
          </button>
          <button
            onClick={scrollToAbout}
            className="px-8 py-3 border border-white/50 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition"
          >
            Learn More
          </button>
        </div>
        <div className="absolute bottom-10 animate-bounce">
          <span className="block w-6 h-6 border-b-2 border-r-2 border-white/75 rotate-45"></span>
        </div>
      </section>

      {/* ABOUT / MISSION SECTION */}
      <section ref={aboutRef} className="relative z-10 w-full py-28 px-6 flex justify-center">
        <div className="max-w-3xl text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-lg">
          <h2 className="text-4xl font-bold mb-6">Why SkillSwap?</h2>
          <p className="text-lg text-white/80 leading-relaxed">
            We believe everyone has something to teach and something to learn. SkillSwap connects
            you with a community where knowledge flows freely — no judgment, just growth.
          </p>
        </div>
      </section>

      {/* SIGNUP / LOGIN SECTION */}
      <section ref={signupRef} className="relative z-10 w-full py-20 flex justify-center px-4">
        <div className="w-full max-w-md p-10 rounded-3xl bg-white/10 backdrop-blur-3xl shadow-2xl border border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h2>

          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] bg-white/30 w-full" />
            <p className="text-white/60">OR</p>
            <div className="h-[1px] bg-white/30 w-full" />
          </div>

          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full mb-4 px-4 py-3 bg-white/20 placeholder-white/70 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mb-4 px-4 py-3 bg-white/20 placeholder-white/70 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4 px-4 py-3 bg-white/20 placeholder-white/70 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <input
                type="text"
                placeholder="Phone Number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mb-4 px-4 py-3 bg-white/20 placeholder-white/70 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </>
          )}

          {isLogin && (
            <input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-4 px-4 py-3 bg-white/20 placeholder-white/70 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-3 bg-white/20 placeholder-white/70 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40"
          />

          <button
            onClick={isLogin ? handleSignIn : handleSignUp}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-bold shadow-lg hover:scale-[1.03] transition"
          >
            {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
          </button>

          <p className="text-center text-white/70 mt-6">
            {isLogin ? "New here?" : "Already a member?"}{" "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-300 cursor-pointer font-semibold hover:underline"
            >
              {isLogin ? "Create Account" : "Log In"}
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
