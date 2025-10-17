import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white">404</h1>
        <h2 className="text-2xl font-semibold text-white mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 mt-2">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            variant="outline"
            className="bg-transparent text-white border-white/20"
          >
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-cyan-600"
          >
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
