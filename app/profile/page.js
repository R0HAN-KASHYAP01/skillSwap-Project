"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  Settings,
  Plus,
  Camera,
  Code,
  Palette,
  Brush,
  Camera as CamIcon,
  Film,
  Pen,
  Megaphone,
  Binary,
  Terminal,
  Coffee,
  Wrench,
  Cpu,
  Mic,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  /** Skill Icons Mapping */
  const SKILL_ICONS = {
    "Web Development": Code,
    "UI/UX Design": Palette,
    "Graphic Design": Brush,
    "Photography": CamIcon,
    "Video Editing": Film,
    "Content Writing": Pen,
    "Digital Marketing": Megaphone,
    Python: Binary,
    "C Programming": Terminal,
    Java: Coffee,
    "Mobile Repairing": Wrench,
    Electronics: Cpu,
    "Public Speaking": Mic,
    Leadership: Users,
  };

  /** LOAD USER */
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("swapp_user"));
    if (!u) return router.push("/");
    setUser(u);

    loadProfile(u.id);
    loadPosts(u.id);
  }, []);

  /** LOAD PROFILE */
  const loadProfile = async (id) => {
    const { data, error } = await supabase
      .from("profile_users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("loadProfile error:", error);
      return;
    }
    setProfile(data);
  };

  /** LOAD POSTS */
  const loadPosts = async (id) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("loadPosts error:", error);
      return;
    }
    setPosts(data || []);
  };

  /** IMAGE UPLOAD */
  const uploadImage = async (file, type) => {
    if (!file || !user) return;

    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/${type}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-pics")
      .upload(filePath, file, { upsert: true });

    if (uploadError) return console.error(uploadError);

    const { data: urlData } = supabase.storage
      .from("profile-pics")
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from("profile_users")
      .update({ [type]: imageUrl })
      .eq("id", user.id);

    if (updateError) return console.error(updateError);

    loadProfile(user.id);
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 w-full min-h-screen bg-[#e9eaec] p-8">
        
        {/* COVER IMAGE */}
        <label className="w-full h-40 bg-gray-400 rounded-2xl mb-6 relative cursor-pointer overflow-hidden block">
          {profile.cover_pic && (
            <img
              src={profile.cover_pic}
              className="absolute inset-0 w-full h-full object-cover"
              alt="cover"
            />
          )}
          {!profile.cover_pic && (
            <div className="flex justify-center items-center w-full h-full">
              <Plus size={50} className="text-white" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadImage(e.target.files[0], "cover_pic")}
            className="hidden"
          />
        </label>

        {/* PROFILE HEADER */}
        <div className="flex justify-between items-center">
          <div className="relative flex items-center gap-6">
            {/* PROFILE PIC */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gray-300 overflow-hidden cursor-pointer border-4 border-white">
                <label className="cursor-pointer w-full h-full flex items-center justify-center">
                  {profile.profile_pic ? (
                    <img
                      src={profile.profile_pic}
                      className="w-full h-full object-cover"
                      alt="profile"
                    />
                  ) : (
                    <span className="text-gray-700">Upload</span>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      uploadImage(e.target.files[0], "profile_pic")
                    }
                    className="hidden"
                  />
                </label>
              </div>

              <label className="absolute bottom-1 right-1 bg-[#263247] p-1 rounded-full cursor-pointer">
                <Camera size={18} color="white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    uploadImage(e.target.files[0], "profile_pic")
                  }
                  className="hidden"
                />
              </label>
            </div>

            {/* NAME + USERNAME + SKILLS + BIO */}
            <div>
              <h1 className="text-3xl text-black font-semibold">
                {profile.full_name}
              </h1>
              <p className="text-gray-700">@{profile.username}</p>

              {/* ⭐⭐⭐ ADDED SKILLS SECTION BEFORE BIO ⭐⭐⭐ */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-3">
                  <h2 className="font-semibold text-lg text-black mb-1">
                    Skills
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => {
                      const Icon = SKILL_ICONS[skill] || Users;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1 bg-[#263247] text-white rounded-full text-sm shadow"
                        >
                          <Icon size={16} />
                          {skill}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BIO (comes AFTER skills) */}
              <p className="text-gray-800 mt-4">{profile.bio}</p>
            </div>
          </div>

          <button
            className="flex items-center gap-2 text-black bg-white px-4 py-2 rounded-lg shadow"
            onClick={() => router.push("/profile/edit")}
          >
            <Settings size={20} /> Edit profile
          </button>
        </div>

        {/* STATS */}
        <div className="flex gap-12 mt-6 text-center text-black">
          <div>
            <p className="text-xl font-semibold">{profile.swaps}</p>
            <p>swaps</p>
          </div>
          <div>
            <p className="text-xl font-semibold">{profile.points}</p>
            <p>points</p>
          </div>
          <div>
            <p className="text-xl font-semibold">{profile.rating}</p>
            <p>rating</p>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-10 w-[98%]">
          <div className="bg-white rounded-xl shadow-md flex">
            {["posts", "reviews", "achievements", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-center font-medium capitalize ${
                  activeTab === tab
                    ? "bg-[#263247] text-white rounded-xl m-1"
                    : "text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* POSTS */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-3 gap-6 mt-8 max-w-[90%]">
            <label className="w-full h-40 bg-[#f3e3c7] rounded-xl flex items-center justify-center cursor-pointer">
              <Plus size={40} />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const path = `${user.id}-${Date.now()}.${file.name.split(".").pop()}`;

                  const { error } = await supabase.storage
                    .from("post-images")
                    .upload(path, file);

                  if (error) return console.error(error);

                  const { data } = supabase.storage
                    .from("post-images")
                    .getPublicUrl(path);

                  await supabase.from("posts").insert({
                    user_id: user.id,
                    image_url: data.publicUrl,
                  });

                  loadPosts(user.id);
                }}
                className="hidden"
              />
            </label>

            {posts.map((p) => (
              <div
                key={p.id}
                className="w-full h-40 rounded-xl overflow-hidden"
              >
                <img
                  src={p.image_url}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
