import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="pt-20 bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover, Monitor & Export
            <span className="block text-green-200">Real-Time Tree Insights</span>
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
            Nanwa provides investors, growers, and admins with comprehensive tools to track every tree in our registry with real-time data and actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white dark:bg-gray-100 text-green-600 dark:text-green-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors"
            >
              Start Your Free Trial
            </Link>
            <a 
              href="#features" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-600 dark:hover:bg-gray-100 dark:hover:text-green-700 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};