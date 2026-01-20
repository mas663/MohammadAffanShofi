"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Profile = {
  name: string;
  username: string;
  tagline: string;
  avatar: string;
  photo?: string;
  about: string;
};

type ProfileContextType = {
  profile: Profile | null;
  loading: boolean;
};

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
