'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { profileAPI } from "@/lib/api";
import Link from "next/link";

export default function EditProfile() {
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState({
    nickname: '',
    year: '',
    interests: [] as string[],
    bio: '',
    emojis: [] as string[]
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newInterest, setNewInterest] = useState('');
  const [newEmoji, setNewEmoji] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profileAPI.getMyProfile();
        const user = response.data.user;
        
        setProfileData({
          nickname: user.nickname || '',
          year: user.year?.toString() || '',
          interests: user.interests || [],
          bio: user.bio || '',
          emojis: user.emojis || []
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchProfile();
    }
  }, [isAuthenticated, isLoading]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData: any = {};
      
      if (profileData.nickname !== undefined) updateData.nickname = profileData.nickname;
      if (profileData.year !== undefined) updateData.year = parseInt(profileData.year) || null;
      if (profileData.interests !== undefined) updateData.interests = profileData.interests;
      if (profileData.bio !== undefined) updateData.bio = profileData.bio;
      if (profileData.emojis !== undefined) updateData.emojis = profileData.emojis;

      await profileAPI.updateProfile(updateData);
      setSuccess('Profile updated successfully!');
      
      // Redirect to profile page after a short delay
      setTimeout(() => {
        router.push('/my-profile');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const addEmoji = () => {
    if (newEmoji.trim() && !profileData.emojis.includes(newEmoji.trim())) {
      setProfileData(prev => ({
        ...prev,
        emojis: [...prev.emojis, newEmoji.trim()]
      }));
      setNewEmoji('');
    }
  };

  const removeEmoji = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      emojis: prev.emojis.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      setError(null);
      await profileAPI.uploadProfilePicture(file);
      setSuccess('Profile picture uploaded successfully!');
      
      // Refresh the page to show the new picture
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload profile picture');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePicture = async () => {
    try {
      setSaving(true);
      setError(null);
      await profileAPI.deleteProfilePicture();
      setSuccess('Profile picture deleted successfully!');
      
      // Refresh the page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete profile picture');
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-xl mb-4">Please sign in to edit your profile</h1>
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

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-red-900">
        <h1 className="text-white text-xl font-bold">Edit Profile</h1>
        <Link href="/my-profile" className="text-white text-sm hover:text-gray-300">
          Cancel
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {error && (
          <div className="bg-red-900 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900 text-white p-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <div className="bg-zinc-900 p-4 rounded">
            <h2 className="text-white font-semibold mb-3">Profile Picture</h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full overflow-hidden">
                {currentUser?.hasProfilePicture ? (
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL}/profile/my-picture`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={saving}
                  />
                  <span className="bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700">
                    Upload New Picture
                  </span>
                </label>
                {currentUser?.hasProfilePicture && (
                  <button
                    onClick={handleDeletePicture}
                    disabled={saving}
                    className="bg-red-600 px-3 py-1 rounded text-xs hover:bg-red-700 text-white disabled:opacity-50"
                  >
                    Delete Picture
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-zinc-900 p-4 rounded">
            <h2 className="text-white font-semibold mb-3">Basic Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-white text-sm block mb-1">Nickname</label>
                <input
                  type="text"
                  value={profileData.nickname}
                  onChange={(e) => setProfileData(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-600 focus:border-red-500 focus:outline-none"
                  placeholder="Enter your nickname"
                />
              </div>
              <div>
                <label className="text-white text-sm block mb-1">Year</label>
                <input
                  type="number"
                  value={profileData.year}
                  onChange={(e) => setProfileData(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-600 focus:border-red-500 focus:outline-none"
                  placeholder="e.g., 2023"
                  min="2000"
                  max="2030"
                />
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-zinc-900 p-4 rounded">
            <h2 className="text-white font-semibold mb-3">Interests</h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  className="flex-1 bg-zinc-800 text-white p-2 rounded border border-zinc-600 focus:border-red-500 focus:outline-none"
                  placeholder="Add an interest"
                />
                <button
                  onClick={addInterest}
                  className="bg-blue-600 px-3 py-2 rounded text-white text-sm hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, index) => (
                  <div key={index} className="bg-zinc-700 text-white px-3 py-1 rounded flex items-center gap-2">
                    <span>{interest}</span>
                    <button
                      onClick={() => removeInterest(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emojis */}
          <div className="bg-zinc-900 p-4 rounded">
            <h2 className="text-white font-semibold mb-3">Emojis</h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEmoji}
                  onChange={(e) => setNewEmoji(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addEmoji()}
                  className="flex-1 bg-zinc-800 text-white p-2 rounded border border-zinc-600 focus:border-red-500 focus:outline-none"
                  placeholder="Add an emoji (e.g., 😊)"
                  maxLength={2}
                />
                <button
                  onClick={addEmoji}
                  className="bg-blue-600 px-3 py-2 rounded text-white text-sm hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.emojis.map((emoji, index) => (
                  <div key={index} className="bg-zinc-700 text-white px-3 py-1 rounded flex items-center gap-2">
                    <span>{emoji}</span>
                    <button
                      onClick={() => removeEmoji(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-zinc-900 p-4 rounded">
            <h2 className="text-white font-semibold mb-3">Bio</h2>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full bg-zinc-800 text-white p-3 rounded border border-zinc-600 focus:border-red-500 focus:outline-none resize-none"
              rows={4}
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <div className="text-gray-400 text-xs mt-1 text-right">
              {profileData.bio.length}/500
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 border-t border-red-900">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
} 