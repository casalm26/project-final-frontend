import { Link } from 'react-router-dom';
import { Navbar } from '../components/ui/Navbar';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Tree Management
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to monitor, analyze, and export tree data with precision and ease.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg dark:shadow-gray-900/50">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Real-Time Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor survival rates, average height, and CO₂ absorption with live-updating charts and metrics.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg dark:shadow-gray-900/50">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Interactive Mapping</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize forests and individual trees with marker clustering and detailed tree information.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg dark:shadow-gray-900/50">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Export</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Export filtered datasets to CSV or XLSX format for reporting and analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Empowering Sustainable Forestry
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Nanwa is dedicated to providing comprehensive tree monitoring solutions that help investors, growers, and environmental analysts make data-driven decisions for sustainable forestry projects.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Our platform offers real-time insights, advanced analytics, and seamless data export capabilities to support your forestry management needs.
              </p>
              <Link 
                to="/register" 
                className="bg-green-600 dark:bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-colors inline-block"
              >
                Join Nanwa Today
              </Link>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">10K+</div>
                  <div className="text-gray-600 dark:text-gray-300">Trees Monitored</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">95%</div>
                  <div className="text-gray-600 dark:text-gray-300">Survival Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50+</div>
                  <div className="text-gray-600 dark:text-gray-300">Forest Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">24/7</div>
                  <div className="text-gray-600 dark:text-gray-300">Real-Time Data</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-4">Nanwa</h3>
              <p className="text-gray-400">
                Empowering sustainable forestry through data-driven insights and real-time monitoring.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nanwa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 