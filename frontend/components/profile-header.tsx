"use client"

import { useEffect, useState } from "react";

interface UserProfile {
  _id: string;
  createdAt: string;
  username: string;
  emails: { address: string; verified: boolean }[];
  profile: {
    name: string;
    status: {
      idle: boolean;
      lastLogin: string;
      lastSeen: string;
      online: boolean;
    };
  };
}

export default function ProfileHeader() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch(
          "https://dev.hoola.vn/manage/api/users/get-me?token=wMgT7sqyBcEF77BT9rky3ka6kiSerYb0jSqmYTcWNaz"
        );
        const data = await res.json();
        if (data && data.user) {
          setUser(data.user);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-gray-300" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-red-500">Không lấy được thông tin người dùng</div>;
  }

  // Render avatar theo chữ cái đầu
  const avatarText = user.profile?.name?.[0]?.toUpperCase() || user.username[0]?.toUpperCase() || "U";

  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
        {avatarText}
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{user.profile?.name || user.username}</span>
        <span className="text-xs text-gray-500">{user.emails?.[0]?.address}</span>
      </div>
    </div>
  );
}
