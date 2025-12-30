import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, Rocket, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    domain: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const pwd = formData.password;
    const missing = [];
    if (pwd.length < 8) missing.push('8+ characters');
    if (!/[A-Z]/.test(pwd)) missing.push('an uppercase letter');
    if (!/[a-z]/.test(pwd)) missing.push('a lowercase letter');
    if (!/[0-9]/.test(pwd)) missing.push('a number');
    if (!/[^A-Za-z0-9]/.test(pwd)) missing.push('a symbol');
    if (missing.length) {
      setError(`Password must include ${missing.join(', ')}`);
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(formData.domain)) {
      setError('Workspace domain can only contain lowercase letters, numbers, and hyphens');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This workspace or email is already registered.');
      } else {
        setError(err.response?.data?.message || 'Failed to register');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Design */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/40 via-gray-900 to-gray-900 z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-20 text-white p-12 max-w-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Start building your scalable SaaS today
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of developers who trust MeterOps for their metering and billing infrastructure.
          </p>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gray-800/50 backdrop-blur border border-gray-700 p-4 rounded-xl">
               <BarChart3 className="w-6 h-6 text-primary mb-2" />
               <div className="font-semibold">Analytics</div>
               <div className="text-xs text-gray-400">Deep usage insights</div>
             </div>
             <div className="bg-gray-800/50 backdrop-blur border border-gray-700 p-4 rounded-xl">
               <Shield className="w-6 h-6 text-green-500 mb-2" />
               <div className="font-semibold">Security</div>
               <div className="text-xs text-gray-400">Enterprise grade</div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-24 overflow-y-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="text-2xl font-bold text-primary tracking-tight">MeterOps</Link>
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start your 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                 {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-gray-900">
                  Company Name
                </label>
                <div className="mt-2">
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-4 bg-gray-50/50"
                    placeholder="Acme Inc."
                  />
                </div>
              </div>
              <div>
                <label htmlFor="domain" className="block text-sm font-medium leading-6 text-gray-900">
                  Workspace
                </label>
                <div className="mt-2 relative">
                  <input
                    id="domain"
                    name="domain"
                    type="text"
                    required
                    value={formData.domain}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-4 bg-gray-50/50"
                    placeholder="acme"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 sm:text-sm">.meterops.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-4 bg-gray-50/50"
                  placeholder="john@acme.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-4 bg-gray-50/50"
                  placeholder="Use 8+ chars with upper/lowercase, number & symbol"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold leading-6 text-primary hover:text-primary-hover">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
