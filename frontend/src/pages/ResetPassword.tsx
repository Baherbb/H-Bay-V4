import React, { useState, FormEvent, ChangeEvent } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setError("");
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const getStrengthColor = (): string => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (passwordStrength < 3) {
      setError("Password is not strong enough");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: formData.password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Password reset failed");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-700 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Password Reset Successful
            </h1>
            <p className="text-gray-600">
              Your password has been successfully reset. You will be redirected
              to the login page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-700 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-auto space-y-6">
        {/* Back to Login Link */}
        <Link
          to="/signin"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>

        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600">Please enter your new password below</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            <div className="space-y-2">
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-full rounded-full ${
                      i < passwordStrength ? getStrengthColor() : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2 flex-wrap text-xs text-gray-600">
                <span
                  className={`flex items-center gap-1 ${
                    formData.password.length >= 8 ? "text-green-500" : ""
                  }`}
                >
                  {formData.password.length >= 8 ? (
                    <Check size={12} />
                  ) : (
                    <AlertCircle size={12} />
                  )}{" "}
                  8+ characters
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    /[A-Z]/.test(formData.password) ? "text-green-500" : ""
                  }`}
                >
                  {/[A-Z]/.test(formData.password) ? (
                    <Check size={12} />
                  ) : (
                    <AlertCircle size={12} />
                  )}{" "}
                  Uppercase
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    /[0-9]/.test(formData.password) ? "text-green-500" : ""
                  }`}
                >
                  {/[0-9]/.test(formData.password) ? (
                    <Check size={12} />
                  ) : (
                    <AlertCircle size={12} />
                  )}{" "}
                  Number
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    /[^A-Za-z0-9]/.test(formData.password)
                      ? "text-green-500"
                      : ""
                  }`}
                >
                  {/[^A-Za-z0-9]/.test(formData.password) ? (
                    <Check size={12} />
                  ) : (
                    <AlertCircle size={12} />
                  )}{" "}
                  Special char
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-sm">Passwords don't match</p>
              )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
