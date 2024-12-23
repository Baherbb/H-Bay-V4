import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { User } from "../../types/auth";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { user: authUser, token, refreshUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      const data = await response.json();
      if (!data.data || !data.data.user) {
        throw new Error('Invalid response format');
      }

      setUser(data.data.user);
      setEditedUser(data.data.user);
      setError("");
    } catch (error) {
      setError("Failed to load profile. Please try refreshing the page.");
      console.error('Profile fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultAvatar = (name: string) => {
    return (
      <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
        {name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
      </div>
    );
  };

const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || !e.target.files[0]) return;

  setImageLoading(true);
  setImageError(false);
  setError("");

  const formData = new FormData();
  formData.append('profile_picture', e.target.files[0]);

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile-picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    await fetchUserProfile();
    await refreshUser();
  } catch (error) {
    console.error('Upload error:', error);
    setError("Failed to upload profile picture. Please try again.");
    setImageError(true);
  } finally {
    setImageLoading(false);
  }
};

const getImageUrl = (profilePicture: string) => {
  if (!profilePicture) return '';
  
  if (profilePicture.startsWith('http')) {
    return profilePicture;
  }
  
  return `${process.env.REACT_APP_API_URL}/api/profile-pictures/${profilePicture}`;
};
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    if (!editedUser) return;

    try {
      setError("");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedUser.name,
          phone: editedUser.phone,
        }),
        credentials: 'include',
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      await fetchUserProfile();
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
    </div>
  );

  if (!user || !editedUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-600 mb-4">Failed to load profile</div>
        <button 
          onClick={fetchUserProfile}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white -mt-20">
      {error && (
        <div className="bg-red-100 text-red-600 p-3 mb-4 rounded flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={() => setError("")}
            className="text-red-600 hover:text-red-800"
          >
            xxx
          </button>
        </div>
      )}

      <div className="bg-orange-500 text-white p-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-sm opacity-90">Manage your personal information and settings</p>
      </div>

      <div className="p-8 max-w-3xl mx-auto">
        <div className="space-y-8">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className={`w-24 h-24 rounded-full overflow-hidden border-4 border-orange-400 bg-gray-100 relative ${imageLoading ? 'opacity-50' : ''}`}>
                {imageLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                  </div>
                ) : imageError ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-100">
                    <span className="text-red-500 text-sm">Error</span>
                  </div>
                ) : editedUser.profile_picture ? (
                  <img
                  src={getImageUrl(editedUser.profile_picture)}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const imgElement = e.currentTarget;
                    console.error('Image load error:', {
                      src: imgElement.src,
                      naturalHeight: imgElement.naturalHeight,
                      naturalWidth: imgElement.naturalWidth
                    });
                    setImageError(true);
                  }}
                />
                ) : (
                  getDefaultAvatar(user.name)
                )}
              </div>
              {isEditing && (
                <label
                  htmlFor="file-upload"
                  className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-2 cursor-pointer hover:bg-orange-600 transition-colors"
                >
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: "Name", value: user.name, name: "name" },
              { label: "Email", value: user.email, name: "email", readonly: true },
              { label: "Phone", value: user.phone, name: "phone" },
            ].map((field) => (
              <div key={field.name} className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {field.label}
                </label>
                {isEditing && !field.readonly ? (
                  <input
                    type="text"
                    name={field.name}
                    value={editedUser[field.name as keyof User] || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{field.value || 'Not set'}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditedUser(user);
                    setIsEditing(false);
                    setError("");
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;