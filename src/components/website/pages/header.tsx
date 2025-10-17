export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">S</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Student Portal
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="" className="hover:text-blue-200 transition-colors duration-300 font-semibold text-white/90 ">
              Dashboard
            </a>
            <a href="" className="hover:text-blue-200 transition-colors duration-300 font-semibold text-white/90 ">
              Courses
            </a>
            <a href="" className="hover:text-blue-200 transition-colors duration-300 font-semibold text-white/90 ">
              Grades
            </a>
            <a href="" className="hover:text-blue-200 transition-colors duration-300 font-semibold text-white/90 ">
              Schedule
            </a>
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-all duration-300">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">TS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};