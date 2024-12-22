import React, { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Loader, ArrowLeft, Mail, Check } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to process request");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    setError("");
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
              Check your email
            </h1>
            <p className="text-gray-600">
              We've sent a password reset link to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-300"
            >
              Try again
            </button>
            <Link
              to="/signin"
              className="block text-center text-orange-600 hover:text-orange-700 font-semibold"
            >
              Return to sign in
            </Link>
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
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
          <p className="text-gray-600">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Sending Instructions...
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

export default ForgotPassword;
