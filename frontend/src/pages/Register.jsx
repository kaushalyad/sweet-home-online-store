import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setToken, backendUrl } = useShop();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Registration successful!");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Registration Box */}
        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-medium text-[#212121]">
              Sign Up
            </h2>
            <p className="mt-1 text-sm text-[#878787]">
              or <Link to="/login" className="text-[#2874f0] font-medium">login</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#212121]">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-[#dbdbdb] rounded-sm shadow-sm placeholder-[#878787] focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                  placeholder="Enter Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#212121]">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-[#dbdbdb] rounded-sm shadow-sm placeholder-[#878787] focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#212121]">
                Mobile Number
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-[#dbdbdb] rounded-sm shadow-sm placeholder-[#878787] focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                  placeholder="Enter Mobile Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#212121]">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-[#dbdbdb] rounded-sm shadow-sm placeholder-[#878787] focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-[#878787]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-[#878787]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#212121]">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-[#dbdbdb] rounded-sm shadow-sm placeholder-[#878787] focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-[#2874f0] hover:bg-[#1a5dc8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2874f0]"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>

        {/* Terms and Privacy */}
        <div className="mt-4 text-center text-xs text-[#878787]">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-[#2874f0] hover:text-[#1a5dc8]">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-[#2874f0] hover:text-[#1a5dc8]">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default Register; 