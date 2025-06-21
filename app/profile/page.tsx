"use client"

interface Profile {
  full_name: string;
  username: string;
  email: string;
  birthday: string;
  horoscope: string;
  zodiac: string;
  height: number;
  weight: number;
}

const mockProfile: Profile = {
  full_name: "Michael Scott",
  username: "michael.scott",
  email: "michael.scott@youapp.ai",
  birthday: "1965-03-15",
  horoscope: "Pisces",
  zodiac: "Snake",
  height: 175,
  weight: 80
}

export default function ProfilePage() {
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  
  function initializeProfile() {
    const loadingElement = document.getElementById('loading-section');
    const errorElement = document.getElementById('error-section');
    const profileElement = document.getElementById('profile-section');
    const errorMessageElement = document.getElementById('error-message');
    
    if (!loadingElement || !errorElement || !profileElement || !errorMessageElement) {
      console.error("Required elements not found");
      return;
    }
    
    loadingElement.classList.remove('hidden');
    errorElement.classList.add('hidden');
    profileElement.classList.add('hidden');
    
    const token = localStorage.getItem("token");
    
    if (!token) {
      loadingElement.classList.add('hidden');
      errorElement.classList.remove('hidden');
      errorMessageElement.textContent = "Unauthorized";
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }
    
    if (token === "dummy-token-for-testing") {
      setTimeout(() => {
        displayProfile(mockProfile);
        loadingElement.classList.add('hidden');
        profileElement.classList.remove('hidden');
      }, 500);
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
      displayProfile(data as Profile);
      loadingElement.classList.add('hidden');
      profileElement.classList.remove('hidden');
    })
    .catch(err => {
      loadingElement.classList.add('hidden');
      errorElement.classList.remove('hidden');
      errorMessageElement.textContent = err.message || "Error loading profile";
    });
  }
  
  function displayProfile(profile: Profile) {
    const nameElement = document.getElementById('profile-name');
    const usernameElement = document.getElementById('profile-username');
    const emailElement = document.getElementById('profile-email');
    const birthdayElement = document.getElementById('profile-birthday');
    const horoscopeElement = document.getElementById('profile-horoscope');
    const zodiacElement = document.getElementById('profile-zodiac');
    const heightElement = document.getElementById('profile-height');
    const weightElement = document.getElementById('profile-weight');
    
    if (nameElement) nameElement.textContent = profile.full_name;
    if (usernameElement) usernameElement.textContent = profile.username;
    if (emailElement) emailElement.textContent = profile.email;
    if (birthdayElement) birthdayElement.textContent = profile.birthday;
    if (horoscopeElement) horoscopeElement.textContent = profile.horoscope;
    if (zodiacElement) zodiacElement.textContent = profile.zodiac;
    if (heightElement) heightElement.textContent = `${profile.height} cm`;
    if (weightElement) weightElement.textContent = `${profile.weight} kg`;
  }
  
  if (typeof window !== 'undefined') {
    setTimeout(initializeProfile, 0);
  }
  
  return (
    <>
      <main id="loading-section" className="flex h-screen items-center justify-center">
        Loading...
      </main>
      
      <main id="error-section" className="hidden flex flex-col h-screen items-center justify-center text-red-500">
        <p id="error-message" className="mb-4"></p>
        <button 
          onClick={() => handleLogout()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Login
        </button>
      </main>
      
      <main id="profile-section" className="hidden flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold mb-4">Profile</h1>
        <div className="w-full max-w-md bg-gray-100 rounded p-4 space-y-2">
          <p><strong>Full Name:</strong> <span id="profile-name"></span></p>
          <p><strong>Username:</strong> <span id="profile-username"></span></p>
          <p><strong>Email:</strong> <span id="profile-email"></span></p>
          <p><strong>Birthday:</strong> <span id="profile-birthday"></span></p>
          <p><strong>Horoscope:</strong> <span id="profile-horoscope"></span></p>
          <p><strong>Zodiac:</strong> <span id="profile-zodiac"></span></p>
          <p><strong>Height:</strong> <span id="profile-height"></span></p>
          <p><strong>Weight:</strong> <span id="profile-weight"></span></p>
        </div>
        <button 
          onClick={() => handleLogout()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </main>
    </>
  );
}
