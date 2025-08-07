"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/contexts/AuthContext";

export default function PeoplePage() {
  const [sortBy, setSortBy] = useState("year-latest");
  const { users, loading, error } = useUsers();
  const { isAuthenticated } = useAuth();

  // Sort users based on selected criteria
  const sortedUsers = useMemo(() => {
    if (!users) return [];
    
    const sorted = [...users];
    switch (sortBy) {
      case "year-latest":
        return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
      case "year-oldest":
        return sorted.sort((a, b) => (a.year || 0) - (b.year || 0));
      case "name":
        return sorted.sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
      default:
        return sorted;
    }
  }, [users, sortBy]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-xl mb-4">Please sign in to view people</h1>
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
        <div className="text-white">Loading people...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-xl mb-4">Error loading people</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-4 px-4">
        <h1 className="text-white font-bold text-base md:text-lg mb-6 text-center">
          Know About everyone in TEDx!
        </h1>
        
        {/* Sort Dropdown */}
        <div className="flex items-center justify-center gap-1 bg-zinc-700 rounded px-3 py-1.5">
          <span className="text-white text-xs">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-white text-xs border-none outline-none cursor-pointer"
          >
            <option value="year-latest" className="bg-zinc-700">Year ( Latest to oldest )</option>
            <option value="year-oldest" className="bg-zinc-700">Year ( Oldest to latest )</option>
            <option value="name" className="bg-zinc-700">Name ( A to Z )</option>
          </select>
          <svg 
            className="w-4 h-4 text-white ml-1" 
            fill="currentColor" 
            viewBox="0 0 16 16"
          >
            <path fillRule="evenodd" d="M9.207 10.707a1 1 0 0 1-1.414 0L4.5 7.414a1 1 0 0 1 1.414-1.414L8.5 8.586l2.586-2.586a1 1 0 0 1 1.414 1.414l-3.293 3.293z"/>
          </svg>
        </div>
      </div>

      {/* People Grid */}
      <div className="flex-1 px-4 md:px-8 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 max-w-6xl mx-auto">
          {sortedUsers.map((person) => (
            <Link 
              key={person._id} 
              href={`/profile/${person._id}`}
              className="group"
            >
              <div className="bg-zinc-900 border border-red-900 rounded p-3 md:p-4 hover:bg-zinc-800 transition-colors cursor-pointer">
                <div className="flex flex-col items-center">
                  {/* Year */}
                  <div className="text-white text-xs mb-2 text-center">
                    {person.year || 'N/A'}
                  </div>
                  
                  {/* Profile Picture */}
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full mb-2 overflow-hidden">
                    {person.hasProfilePicture && (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL}/profile/picture/${person._id}`}
                        alt={person.displayName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Name */}
                  <div className="text-white text-xs md:text-sm text-center mb-2 group-hover:text-gray-300 transition-colors">
                    {person.nickname || person.displayName}
                  </div>
                  
                  {/* Emojis/Status Indicators */}
                  <div className="flex gap-1">
                    {person.emojis && person.emojis.slice(0, 3).map((emoji, index) => (
                      <div key={index} className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full flex items-center justify-center text-xs">
                        {emoji}
                      </div>
                    ))}
                    {(!person.emojis || person.emojis.length === 0) && (
                      <>
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-red-950 h-20 flex items-center justify-center px-4">
        <nav className="flex items-center justify-center gap-8 md:gap-12 w-full max-w-md">
          <div className="bg-white text-black px-5 py-2 rounded text-xs font-normal">
            People
          </div>
          <Link 
            href="/" 
            className="text-white text-xs font-normal hover:text-gray-300 transition-colors"
          >
            Gallery
          </Link>
          <Link 
            href="/my-profile" 
            className="text-white text-xs font-normal hover:text-gray-300 transition-colors"
          >
            My Profile
          </Link>
        </nav>
      </div>
    </div>
  );
}
