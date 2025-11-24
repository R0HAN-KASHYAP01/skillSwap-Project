// app/profile/edit/page.js
"use client";

import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditProfilePage() {
  const router = useRouter();

  const SKILL_OPTIONS = [
    "Web Development", "UI/UX Design", "Graphic Design", "Photography",
    "Video Editing", "Content Writing", "Digital Marketing",
    "Python", "C Programming", "Java", "Mobile Repairing",
    "Electronics", "Public Speaking", "Leadership"
  ];

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);

  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Load user data
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("swapp_user"));
    if (!u) return router.push("/");
    setUser(u);

    (async () => {
      const { data, error } = await supabase
        .from("profile_users")
        .select("*")
        .eq("id", u.id)
        .single();

      if (error) return console.error("load edit profile error", error);

      setName(data.full_name);
      setUsername(data.username);
      setBio(data.bio || "");
      setSkills(data.skills || []);
    })();
  }, []);

  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const saveProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profile_users")
      .update({ full_name: name, username, bio, skills })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("saveProfile error", error);
      return;
    }

    localStorage.setItem("swapp_user", JSON.stringify(data));
    router.push("/profile");
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 p-8 w-full bg-[#f2f3f5] min-h-screen text-black">
        <h1 className="text-3xl font-semibold mb-6">Edit Profile</h1>

        <div className="space-y-4 max-w-lg">

          {/* NAME */}
          <div>
            <label className="font-semibold">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg border bg-white"
            />
          </div>

          {/* USERNAME */}
          <div>
            <label className="font-semibold">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg border bg-white"
            />
          </div>

          {/* BIO */}
          <div>
            <label className="font-semibold">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg border bg-white"
            />
          </div>

          {/* SKILLS SECTION */}
          <div>
            <label className="font-semibold block mb-2">Skills</label>

            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-md"
              onClick={() => setSkillsModalOpen(true)}
            >
              Select Skills
            </button>

            <div className="flex flex-wrap gap-2 mt-3">
              {skills.length === 0 ? (
                <p className="text-gray-600 text-sm">No skills selected</p>
              ) : (
                skills.map((s) => (
                  <span
                    key={s}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-300 shadow-sm"
                  >
                    {s}
                  </span>
                ))
              )}
            </div>
          </div>

          <button
            onClick={saveProfile}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* GLASS EFFECT MODAL */}
      {skillsModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="w-[90%] max-w-lg p-6 rounded-2xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl text-white">

            <h2 className="text-xl font-semibold mb-4 text-white drop-shadow">
              Select Your Skills
            </h2>

            {/* SEARCH BAR */}
            <input
              type="text"
              placeholder="Search skills..."
              className="w-full p-2 mb-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* SKILLS LIST */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {SKILL_OPTIONS.filter((sk) =>
                sk.toLowerCase().includes(search.toLowerCase())
              ).map((skill) => (
                <label
                  key={skill}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition border
                    ${
                      skills.includes(skill)
                        ? "bg-blue-500/30 border-blue-300 text-white shadow-lg"
                        : "bg-white/10 border-white/30 hover:bg-white/20"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={skills.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                    className="w-4 h-4 accent-blue-400"
                  />
                  <span className="text-sm font-medium">{skill}</span>
                </label>
              ))}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setSkillsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white"
              >
                Close
              </button>

              <button
                onClick={() => setSkillsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
