import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="py-8 px-6 sm:px-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Join WeatherNow to get personalized weather updates and save your favorite locations
            </p>
          </div>
          
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}