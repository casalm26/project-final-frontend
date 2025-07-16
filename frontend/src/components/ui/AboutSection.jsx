import { Link } from 'react-router-dom';
import { StatsGrid } from './StatsGrid';

export const AboutSection = () => {
  return (
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
          <StatsGrid />
        </div>
      </div>
    </section>
  );
};