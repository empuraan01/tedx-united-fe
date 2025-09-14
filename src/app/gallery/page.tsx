'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { galleryAPI } from '@/lib/api';
import { Album } from '@/types/gallery';

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await galleryAPI.getAlbums();
      setAlbums(response.data);
    } catch (err: any) {
      console.error('Error fetching albums:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch albums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading albums...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-xl mb-4">Error loading albums</h1>
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
          Photo Gallery - TEDx Events!
        </h1>
      </div>

      {/* Albums Grid */}
      <div className="flex-1 px-4 md:px-8 pb-24">
        {albums.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📸</div>
            <h2 className="text-white text-xl mb-2">No Albums Found</h2>
            <p className="text-gray-400">No photo albums are currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {albums.map((album, albumIndex) => (
              <a
                key={albumIndex}
                href={album.albumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="bg-zinc-900 border border-red-900 rounded p-4 hover:bg-zinc-800 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    {/* Album Icon */}
                    <div className="w-16 h-16 bg-red-600 rounded-full mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L16.5 11 8.5 13.5z"/>
                        <path d="M4 6h16v12H4z"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                      </svg>
                    </div>
                    
                    {/* Album Title */}
                    <h3 className="text-white text-sm md:text-base mb-4 group-hover:text-gray-300 transition-colors">
                      {album.title}
                    </h3>
                    
                    {/* View Button */}
                    <div className="bg-red-600 text-white px-4 py-2 rounded text-xs group-hover:bg-red-700 transition-colors">
                      View on Google Photos →
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-red-950 h-20 flex items-center justify-center px-4">
        <nav className="flex items-center justify-center gap-8 md:gap-12 w-full max-w-md">
          <Link 
            href="/people" 
            className="text-white text-xs font-normal hover:text-gray-300 transition-colors"
          >
            People
          </Link>
          <div className="bg-white text-black px-5 py-2 rounded text-xs font-normal">
            Gallery
          </div>
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
