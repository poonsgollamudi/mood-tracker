import React, { useState, useEffect } from "react";
import {
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Calendar,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { supabase } from "./supabaseClient";

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [showUplifter, setShowUplifter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [imageCredit, setImageCredit] = useState({ name: "", link: "" });

  const moodtracker = [
    {
      value: "great",
      label: "Great",
      icon: Smile,
      color: "bg-green-500",
      emoji: "😄",
    },
    {
      value: "okay",
      label: "Okay",
      icon: Meh,
      color: "bg-yellow-500",
      emoji: "😐",
    },
    {
      value: "down",
      label: "Down",
      icon: Frown,
      color: "bg-orange-500",
      emoji: "😔",
    },
    {
      value: "bad",
      label: "Bad",
      icon: Frown,
      color: "bg-red-500",
      emoji: "😢",
    },
  ];

  const inspiringMessages = [
    "Every storm runs out of rain. Tomorrow is a new day! 🌈",
    "You're stronger than you think. This too shall pass! 💪",
    "Bad days are just plot twists in your success story! 📖",
    "Remember: you've survived 100% of your worst days! 🎯",
    "Your vibe attracts your tribe. Keep your head up! ✨",
    "Tough times don't last, but tough people do! 🦾",
    "You're doing better than you think you are! 🌟",
    "Small steps forward are still progress! 🚀",
    "Your comeback is always stronger than your setback! 💫",
    "Keep going, you're closer than you were yesterday! 🎈",
  ];

  const upliftingSearchTerms = [
    "happy dog",
    "cute puppy",
    "funny cat",
    "baby animals",
    "sunset beach",
    "colorful flowers",
    "rainbow",
    "happy people laughing",
    "peaceful nature",
    "cute kitten",
  ];
  const unsplashKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  // Load mood history on mount - NO AUTHENTICATION
  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("moodtracker")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Supabase error:", error);
        // Fallback to localStorage
        const stored = localStorage.getItem("moodHistory");
        if (stored) {
          setMoodHistory(JSON.parse(stored));
        }
      } else {
        setMoodHistory(data || []);
      }
    } catch (error) {
      console.error("Error loading mood history:", error);
      // Fallback to localStorage
      const stored = localStorage.getItem("moodHistory");
      if (stored) {
        setMoodHistory(JSON.parse(stored));
      }
    }
    setLoading(false);
  };

  const generateFunnyImage = async () => {
    setImageLoading(true);
    const randomTerm =
      upliftingSearchTerms[
        Math.floor(Math.random() * upliftingSearchTerms.length)
      ];

    const unsplashKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

    try {
      if (unsplashKey) {
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
            randomTerm
          )}&orientation=squarish&client_id=${unsplashKey}`,
          { headers: { Accept: "application/json" } }
        );

        if (response.ok) {
          const data = await response.json();
          setGeneratedImage(data.urls.regular);
          setImageCredit({ name: data.user.name, link: data.user.links.html });
          setImageLoading(false);
          return;
        }
      }

      // Fallback to source.unsplash.com (no API key needed)
      setGeneratedImage(`https://source.unsplash.com/500x500/?${randomTerm}`);
      setImageCredit({ name: "Unsplash", link: "https://unsplash.com" });
    } catch (error) {
      console.error("Error loading image:", error);
      setGeneratedImage(`https://source.unsplash.com/500x500/?${randomTerm}`);
      setImageCredit({ name: "Unsplash", link: "https://unsplash.com" });
    }
    setImageLoading(false);
  };

  const saveMood = async (mood) => {
    const timestamp = new Date().toISOString();
    const moodEntry = {
      mood: mood.value,
      label: mood.label,
      emoji: mood.emoji,
      timestamp,
    };

    try {
      // Try to save to Supabase
      const { data, error } = await supabase
        .from("moodtracker")
        .insert([moodEntry])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        // Fallback to localStorage
        const updated = [{ ...moodEntry, id: Date.now() }, ...moodHistory];
        localStorage.setItem("moodHistory", JSON.stringify(updated));
        setMoodHistory(updated);
      } else {
        setMoodHistory([data[0], ...moodHistory]);
        // Also save to localStorage as backup
        const updated = [data[0], ...moodHistory];
        localStorage.setItem("moodHistory", JSON.stringify(updated));
      }

      setCurrentMood(mood);

      if (mood.value === "down" || mood.value === "bad") {
        await generateFunnyImage();
        setShowUplifter(true);
      }
    } catch (error) {
      console.error("Error saving mood:", error);
      // Fallback to localStorage
      const updated = [{ ...moodEntry, id: Date.now() }, ...moodHistory];
      localStorage.setItem("moodHistory", JSON.stringify(updated));
      setMoodHistory(updated);
    }
  };

  const getRandomMessage = () => {
    return inspiringMessages[
      Math.floor(Math.random() * inspiringMessages.length)
    ];
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }
  };

  const getMoodStats = () => {
    if (moodHistory.length === 0) return null;

    const counts = moodHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-xl text-purple-600">
          Loading your mood journey...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            Mood Tracker
          </h1>
          <p className="text-purple-600">How are you feeling today?</p>
        </div>

        {!showUplifter && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              {moodtracker.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => saveMood(mood)}
                  className={`${mood.color} hover:opacity-90 text-white rounded-xl p-6 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-3`}
                >
                  <span className="text-4xl">{mood.emoji}</span>
                  <span className="text-xl font-semibold">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showUplifter && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                We've got you! 💜
              </h2>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                {imageLoading ? (
                  <div className="w-full max-w-sm h-64 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-gray-500">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-2"></div>
                      Finding an uplifting photo...
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={generatedImage}
                      alt="Uplifting"
                      className="w-full max-w-sm mx-auto rounded-lg shadow-md mb-2"
                    />
                    {imageCredit.name && (
                      <p className="text-xs text-gray-500 mb-3">
                        Photo by{" "}
                        <a
                          href={imageCredit.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          {imageCredit.name}
                        </a>
                      </p>
                    )}
                    <button
                      onClick={generateFunnyImage}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-2 mx-auto mb-4"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Show me another photo
                    </button>
                  </>
                )}
                <p className="text-lg text-purple-700 font-medium">
                  {getRandomMessage()}
                </p>
              </div>

              <button
                onClick={() => setShowUplifter(false)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold"
              >
                Thanks! 💪
              </button>
            </div>
          </div>
        )}

        {moodHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-purple-800">
                Your Mood Stats
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(getMoodStats()).map(([mood, count]) => {
                const moodData = moodtracker.find((m) => m.value === mood);
                return (
                  <div
                    key={mood}
                    className="bg-gray-50 rounded-lg p-3 flex items-center gap-3"
                  >
                    <span className="text-2xl">{moodData?.emoji}</span>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {moodData?.label}
                      </div>
                      <div className="text-sm text-gray-600">{count} times</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-purple-800">Recent Moods</h3>
          </div>

          {moodHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No mood entries yet. Track your first mood above!
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {moodHistory.slice(0, 20).map((entry, index) => {
                const moodData = moodtracker.find(
                  (m) => m.value === entry.mood
                );
                return (
                  <div
                    key={entry.id || index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-3xl">{entry.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {entry.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(entry.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
