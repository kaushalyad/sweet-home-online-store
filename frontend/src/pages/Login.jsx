import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setToken, backendUrl, token } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = loginMethod === "email" ? "/api/user/login" : "/api/user/login/phone";
      const payload = loginMethod === "email" 
        ? { email: formData.email, password: formData.password }
        : { phone: formData.phone, password: formData.password };

      const response = await axios.post(backendUrl + endpoint, payload, {
        withCredentials: true
      });

      if (response.data.success) {
        const token = response.data.token;
        setToken(token);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Login Box */}
        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-medium text-[#212121]">
              Login
            </h2>
            <p className="mt-1 text-sm text-[#878787]">
              or <Link to="/register" className="text-[#2874f0] font-medium">sign up</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#212121]">
                {loginMethod === "email" ? "Email" : "Mobile Number"}
              </label>
              <div className="mt-1">
                <input
                  type={loginMethod === "email" ? "email" : "tel"}
                  name={loginMethod === "email" ? "email" : "phone"}
                  id={loginMethod === "email" ? "email" : "phone"}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-[#dbdbdb] rounded-sm shadow-sm placeholder-[#878787] focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm"
                  placeholder={loginMethod === "email" ? "Enter Email" : "Enter Mobile Number"}
                  value={loginMethod === "email" ? formData.email : formData.phone}
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2874f0] focus:ring-[#2874f0] border-[#dbdbdb] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#212121]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-[#2874f0] hover:text-[#1a5dc8]">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-[#2874f0] hover:bg-[#1a5dc8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2874f0]"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#dbdbdb]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#878787]">OR</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setLoginMethod(loginMethod === "email" ? "phone" : "email")}
                className="w-full flex justify-center py-2 px-4 border border-[#dbdbdb] rounded-sm shadow-sm text-sm font-medium text-[#212121] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2874f0]"
              >
                {loginMethod === "email" ? "Login with Mobile Number" : "Login with Email"}
              </button>
            </div>
          </div>
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

export default Login;
