'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { profileAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function MyProfile() {
  const { user: currentUser, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await profileAPI.getMyProfile();
        setProfileUser(response.data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchProfile();
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-xl mb-4">Please sign in to view profiles</h1>
          <Link href="/" className="text-red-500 hover:text-red-400">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-xl mb-4">Error loading profile</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Profile not found</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Profile Content */}
      <div className="flex-1 flex flex-col items-center px-6 py-8">
        {/* Profile Picture */}
        <div className="w-36 h-36 bg-white rounded-full mb-6 overflow-hidden">
          {profileUser.hasProfilePicture ? (
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL}/profile/picture/${profileUser._id}`}
              alt={profileUser.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">
              {profileUser.displayName?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="text-center mb-8">
          <h1 className="text-white text-xl font-bold mb-1">
            {profileUser.nickname || profileUser.displayName}
          </h1>
          <p className="text-white text-xs font-normal mb-1">
            {profileUser.year || 'N/A'}
          </p>
          <p className="text-white text-xs font-normal">
            {profileUser.email}
          </p>
        </div>

        {/* Social Icons/Tags */}
        <div className="flex items-center gap-4 mb-12">
          {profileUser.emojis && profileUser.emojis.slice(0, 3).map((emoji: string, index: number) => (
            <div key={index} className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-sm">
              {emoji}
            </div>
          ))}
          {(!profileUser.emojis || profileUser.emojis.length === 0) && (
            <>
              <div className="w-8 h-8 bg-gray-400 rounded-full" />
              <div className="w-8 h-8 bg-gray-400 rounded-full" />
              <div className="w-8 h-8 bg-gray-400 rounded-full" />
            </>
          )}
        </div>

        {/* Loves Section */}
        <div className="w-full max-w-sm">
          <h2 className="text-white text-xs font-bold text-center mb-4">Loves</h2>
          
          {/* Interest Cards */}
          <div className="grid grid-cols-4 gap-2 mb-8 justify-items-center">
            {profileUser.interests && profileUser.interests.slice(0, 4).map((interest: string, index: number) => (
              <div key={index} className="h-12 bg-gray-600 rounded flex items-center justify-center p-2 w-full">
                <span className="text-white text-xs text-center truncate">
                  {interest}
                </span>
              </div>
            ))}
            {(!profileUser.interests || profileUser.interests.length === 0) && (
              <>
                <div className="h-12 bg-gray-600 rounded w-full" />
                <div className="h-12 bg-gray-600 rounded w-full" />
                <div className="h-12 bg-gray-600 rounded w-full" />
                <div className="h-12 bg-gray-600 rounded w-full" />
              </>
            )}
          </div>

          {/* Bio Content Area */}
          <div className="w-full min-h-[14rem] border border-red-800 rounded-md p-4">
            <p className="text-white text-sm">
              {profileUser.bio || 'No bio available'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-red-950 h-20 flex items-center justify-center px-4">
        <nav className="flex items-center justify-center gap-8 md:gap-12 w-full max-w-md">
          <Link
            href="/people"
            className="text-white text-xs font-normal hover:text-gray-300 transition-colors"
          >
            People
          </Link>
          <Link
            href="/"
            className="text-white text-xs font-normal hover:text-gray-300 transition-colors"
          >
            Gallery
          </Link>
          <div className="bg-white text-black px-5 py-2 rounded text-xs font-normal">
            My Profile
          </div>
          <Link
            href="/edit-profile"
            className="text-white text-xs font-normal hover:text-gray-300 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleLogout}
            className="text-white text-xs font-normal hover:text-gray-300 transition-colors"
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
} 