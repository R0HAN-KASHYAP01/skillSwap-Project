"use client";
import Link from "next/link";
import {
  Home,
  Search,
  MessageSquare,
  Compass,
  Repeat,
  Bell,
  User,
  MoreHorizontal,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#0a1123] text-white p-6 fixed left-0 top-0 flex flex-col justify-between">
      
      {/* TOP SECTION */}
      <div>
        <h1 className="text-3xl font-bold mb-8">SkillSwap</h1>

        <nav className="space-y-6">
          <Link href="/" className="flex items-center gap-3 hover:text-gray-300">
            <Home /> Home
          </Link>
          <Link href="/search" className="flex items-center gap-3 hover:text-gray-300">
            <Search /> Search
          </Link>
          <Link href="/messages" className="flex items-center gap-3 hover:text-gray-300">
            <MessageSquare /> Messages
          </Link>
          <Link href="/explore" className="flex items-center gap-3 hover:text-gray-300">
            <Compass /> Explore
          </Link>
          <Link href="/swap" className="flex items-center gap-3 hover:text-gray-300">
            <Repeat /> Swap
          </Link>
          <Link href="/notification" className="flex items-center gap-3 hover:text-gray-300">
            <Bell /> Notification
          </Link>
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="space-y-6 pb-4">
        <Link href="/profile" className="flex items-center gap-3 hover:text-gray-300">
          <User /> Profile
        </Link>
        <Link href="/more" className="flex items-center gap-3 hover:text-gray-300">
          <MoreHorizontal /> More
        </Link>
      </div>
    </div>
  );
}
