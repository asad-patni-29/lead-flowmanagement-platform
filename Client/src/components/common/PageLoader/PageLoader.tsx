/**
 * PageLoader - A compact loader for page transitions
 * Use this for smaller loading states within pages
 */
const PageLoader = () => {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center space-y-3">
        {/* Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full"></div>
          </div>
        </div>
        
        {/* Text */}
        <p className="text-sm font-medium text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
