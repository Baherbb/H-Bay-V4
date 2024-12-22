import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const AccountSettings: React.FC = () => {
  const { user, token } = useAuth();
  
  // Form states
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEmailUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/email`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to update email');

      showMessage("Email updated successfully!", "success");
    } catch (error) {
      showMessage("Failed to update email", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneNumberUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/phone`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!response.ok) throw new Error('Failed to update phone number');

      showMessage("Phone number updated successfully!", "success");
    } catch (error) {
      showMessage("Failed to update phone number", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage("Please fill out all password fields.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("New Password and Confirm Password do not match.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      if (!response.ok) throw new Error('Failed to update password');

      showMessage("Password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      showMessage("Failed to update password", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white">
      <div className="bg-orange-500 text-white -mt-20 px-3 py-3 shadow-md">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-sm opacity-90">Manage your account preferences and security</p>
      </div>

      <div className="px-6 py-4">
        <div className="space-y-6">
          {message && (
            <div
              className={`p-2 rounded-lg text-center font-semibold ${
                messageType === "error"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {message}
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Update Email</h2>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-l focus:ring-orange-500 focus:border-orange-500"
                disabled={isLoading}
              />
              <button
                onClick={handleEmailUpdate}
                className="bg-orange-500 text-white px-4 rounded-r hover:bg-orange-600 transition duration-300 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Update Phone Number</h2>
            <div className="flex">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 border rounded-l focus:ring-orange-500 focus:border-orange-500"
                disabled={isLoading}
              />
              <button
                onClick={handlePhoneNumberUpdate}
                className="bg-orange-500 text-white px-4 rounded-r hover:bg-orange-600 transition duration-300 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Update Password</h2>
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                disabled={isLoading}
              />
              <button
                onClick={handlePasswordUpdate}
                className="bg-orange-500 text-white w-full px-4 py-2 rounded hover:bg-orange-600 transition duration-300 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;