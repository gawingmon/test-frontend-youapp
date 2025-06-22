"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { FaChevronLeft, FaSignOutAlt, FaTimes, FaCamera, FaEdit } from "react-icons/fa"
import { FiEdit } from "react-icons/fi"
import Image from "next/image"

interface Profile {
  full_name: string;
  username: string;
  email: string;
  birthday: string;
  horoscope: string;
  zodiac: string;
  height: number;
  weight: number;
  gender?: string;
  profile_image?: string;
  interests?: string[];
  age?: number;
}

const mockProfile: Profile = {
  full_name: "John Doe",
  username: "johndoe123",
  email: "john.doe@youapp.ai",
  birthday: "1995-08-28",
  horoscope: "Virgo",
  zodiac: "Pig",
  height: 175,
  weight: 69,
  gender: "Male",
  profile_image: "https://i.pravatar.cc/300?img=1",
  interests: ["Music", "Basketball", "Fitness", "Gymming"],
  age: 28
}

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editSection, setEditSection] = useState<"about" | "interest" | null>(null)
  const [formData, setFormData] = useState<Profile | null>(null)
  const [newInterest, setNewInterest] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const availableInterests = [
    "Music", "Basketball", "Football", "Fitness", "Gymming", 
    "Reading", "Cooking", "Gaming", "Traveling", "Photography",
    "Dancing", "Singing", "Painting", "Writing", "Hiking"
  ]

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    if (profile) {
      setFormData(profile)
      if (profile.profile_image) {
        setImagePreview(profile.profile_image)
      }
    }
  }, [profile])

  function handleLogout() {
    router.push("/login");
  }
  
  function loadProfile() {
    const token = "dummy-token-for-testing"; 
    
    if (!token) {
      setError("Unauthorized");
      setIsLoading(false);
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }
    
    if (token === "dummy-token-for-testing") {
      setTimeout(() => {
        setProfile(mockProfile);
        setIsLoading(false);
      }, 1000);
      return;
    }
    
    fetch("http://techtest.youapp.ai/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(data => {
          throw new Error(data.message || "Gagal ambil profile");
        });
      }
      return res.json();
    })
    .then(data => {
      const birthDate = new Date(data.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setProfile({...data, age});
      setIsLoading(false);
    })
    .catch(err => {
      setError(err.message || "Error loading profile");
      setIsLoading(false);
    });
  }

  function calculateAge(birthday: string) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (!formData) return;
    
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSave() {
    if (!formData) return;
    
    if (formData.birthday) {
      const age = calculateAge(formData.birthday);
      formData.age = age;
    }
    
    if (imagePreview && imagePreview !== profile?.profile_image) {
      formData.profile_image = imagePreview;
    }
    
    setProfile(formData);
    setEditMode(false);
    setEditSection(null);
  }

  function addInterest() {
    if (!newInterest.trim() || !formData) return;
    
    const updatedInterests = [...(formData.interests || [])];
    if (!updatedInterests.includes(newInterest)) {
      updatedInterests.push(newInterest);
      setFormData({
        ...formData,
        interests: updatedInterests
      });
    }
    setNewInterest("");
  }

  function removeInterest(interest: string) {
    if (!formData || !formData.interests) return;
    
    const updatedInterests = formData.interests.filter(i => i !== interest);
    setFormData({
      ...formData,
      interests: updatedInterests
    });
  }

  function handleEdit(section: "about" | "interest") {
    setEditMode(true);
    setEditSection(section);
  }

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setIsUploadingImage(false);
      if (formData) {
        const updatedProfile = {
          ...formData,
          profile_image: reader.result as string
        };
        setFormData(updatedProfile);
        setProfile(updatedProfile);
      }
    };
    reader.readAsDataURL(file);

  }

  function renderProfileImage() {
    const currentImage = imagePreview || profile?.profile_image;
  
  return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-2">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20">
            {currentImage ? (
              <Image 
                src={currentImage} 
                alt="Profile" 
                width={96}
                height={96}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://i.pravatar.cc/96?img=1";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                <FaCamera className="text-gray-400 text-xl" />
              </div>
            )}
          </div>
          
          {isUploadingImage && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <button 
          onClick={handleImageClick}
          className="flex items-center gap-2 bg-[#D2FF3A] px-3 py-1.5 rounded-full hover:bg-[#E0FF6E] transition-colors shadow-lg"
        >
          <FaEdit className="text-black text-xs" />
          <span className="text-black text-sm">Change Photo</span>
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
          accept="image/*"
        />
      </div>
    );
  }

  function renderProfileBanner() {
    if (!profile) return null;
    
    const currentImage = imagePreview || profile.profile_image;
    
    return (
      <div className="relative w-full h-60 rounded-xl overflow-hidden mb-6">
        <div className="absolute inset-0">
          {currentImage ? (
            <div className="relative w-full h-full">
              <Image 
                src={currentImage} 
                alt="Profile background" 
                fill
                className="object-cover opacity-30 blur-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://i.pravatar.cc/400?img=1";
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600"></div>
          )}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          {renderProfileImage()}
          
          <div className="text-center">
            <h2 className="text-xl font-bold mb-1">@{profile.username}</h2>
            <p className="text-sm text-gray-200 mb-3">{profile.full_name}</p>
            
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{profile.horoscope}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" strokeWidth="2"/>
                </svg>
                <span>{profile.zodiac}</span>
              </div>
              
              {profile.age && (
                <div className="flex items-center gap-1">
                  <span>{profile.age} years</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderAboutEdit() {
    if (!formData) return null;
    
    return (
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-white">About</h2>
          <button 
            onClick={handleSave}
            className="text-[#D2FF3A] text-sm font-medium hover:underline"
          >
            Save
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 items-center">
            <span className="text-gray-400 text-sm">Display name:</span>
            <input 
              type="text" 
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="bg-[#162329] text-white p-2 rounded-md text-right w-full text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 items-center">
            <span className="text-gray-400 text-sm">Gender:</span>
            <select 
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="bg-[#162329] text-white p-2 rounded-md text-right w-full text-sm"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 items-center">
            <span className="text-gray-400 text-sm">Birthday:</span>
            <input 
              type="date" 
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="bg-[#162329] text-white p-2 rounded-md text-right w-full text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 items-center">
            <span className="text-gray-400 text-sm">Height:</span>
            <input 
              type="number" 
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="bg-[#162329] text-white p-2 rounded-md text-right w-full text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 items-center">
            <span className="text-gray-400 text-sm">Weight:</span>
            <input 
              type="number" 
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="bg-[#162329] text-white p-2 rounded-md text-right w-full text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  function renderInterestEdit() {
    if (!formData) return null;
    
    return (
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-white">Interest</h2>
          <button 
            onClick={handleSave}
            className="text-[#D2FF3A] text-sm font-medium hover:underline"
          >
            Save
          </button>
        </div>
        
        <div className="flex flex-wrap mb-4">
          {formData.interests && formData.interests.length > 0 ? (
            formData.interests.map((interest, index) => (
              <div 
                key={index} 
                className="bg-white/10 text-white px-4 py-1 rounded-full text-sm flex items-center mr-2 mb-2"
              >
                {interest}
                <button 
                  onClick={() => removeInterest(interest)}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm">No interests added yet</div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            className="flex-1 bg-[#162329] text-white p-2 rounded-md text-sm"
          >
            <option value="">Select an interest</option>
            {availableInterests.filter(interest => 
              !formData.interests || !formData.interests.includes(interest)
            ).map((interest, index) => (
              <option key={index} value={interest}>{interest}</option>
            ))}
          </select>
          <button
            onClick={addInterest}
            disabled={!newInterest}
            className={`px-3 py-2 rounded-md text-sm ${
              newInterest 
                ? "bg-[#D2FF3A] text-black hover:bg-[#E0FF6E]" 
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Add
          </button>
        </div>
      </div>
    );
  }

  function renderAbout() {
    if (!profile) return null;
    
    return (
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-white">About</h2>
          <button 
            onClick={() => handleEdit("about")}
            className="text-[#D2FF3A] hover:text-[#E0FF6E] transition-colors"
          >
            <FiEdit size={16} />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 items-center">
            <span className="text-gray-400 text-sm">Birthday:</span>
            <span className="text-white text-sm text-right">{formatDate(profile.birthday)} (Age {profile.age})</span>
          </div>
          
          <div className="grid grid-cols-2 items-center">
            <span className="text-gray-400 text-sm">Horoscope:</span>
            <span className="text-white text-sm text-right">{profile.horoscope}</span>
          </div>
          
          <div className="grid grid-cols-2 items-center">
            <span className="text-gray-400 text-sm">Zodiac:</span>
            <span className="text-white text-sm text-right">{profile.zodiac}</span>
          </div>
          
          <div className="grid grid-cols-2 items-center">
            <span className="text-gray-400 text-sm">Height:</span>
            <span className="text-white text-sm text-right">{profile.height} cm</span>
          </div>
          
          <div className="grid grid-cols-2 items-center">
            <span className="text-gray-400 text-sm">Weight:</span>
            <span className="text-white text-sm text-right">{profile.weight} kg</span>
          </div>
        </div>
      </div>
    );
  }

  function renderInterest() {
    if (!profile) return null;
    
    return (
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-white">Interest</h2>
          <button 
            onClick={() => handleEdit("interest")}
            className="text-[#D2FF3A] hover:text-[#E0FF6E] transition-colors"
          >
            <FiEdit size={16} />
          </button>
        </div>
        
        <div className="flex flex-wrap">
          {profile.interests && profile.interests.length > 0 ? (
            profile.interests.map((interest, index) => (
              <div 
                key={index} 
                className="bg-white/10 text-white px-4 py-1 rounded-full text-sm mr-2 mb-2"
              >
                {interest}
              </div>
            ))
          ) : (
            <div className="bg-white/10 text-gray-400 px-4 py-1 rounded-full text-sm">
              No interests added
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <main className="flex flex-col items-center min-h-screen bg-[#0F172A] text-white">
      {/* Status Bar - Mobile Look */}
            <div className="w-full max-w-sm mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between relative mb-2">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-white"
          >
            <FaChevronLeft className="mr-1" />
            <span className="text-sm">Back</span>
          </button>
          
          {profile && (
            <div className="absolute left-1/2 transform -translate-x-1/2 text-white text-sm font-medium">
              @{profile.username}
            </div>
          )}
           
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaSignOutAlt size={16} />
            <span className="text-sm">Logout</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <div className="w-10 h-10 border-3 border-[#D2FF3A] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-sm">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <div className="bg-red-500/20 p-4 rounded-lg text-red-400 mb-4 text-sm">
              {error}
        </div>
        <button 
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-[#D2FF3A] text-black rounded-lg hover:bg-[#E0FF6E] transition-colors text-sm"
        >
              Back to Login
        </button>
          </div>
        ) : (
          <>
            {renderProfileBanner()}
            
            {editMode && editSection === "about" ? renderAboutEdit() : 
             editMode && editSection === "interest" ? renderInterestEdit() : 
             (
               <>
                 {renderAbout()}
                 {renderInterest()}
               </>
             )
            }
          </>
        )}
      </div>
      </main>
  );
}