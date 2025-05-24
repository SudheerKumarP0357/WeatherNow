import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="py-8 px-6 sm:px-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign in to WeatherNow
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Access your account to view personalized weather information
            </p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}