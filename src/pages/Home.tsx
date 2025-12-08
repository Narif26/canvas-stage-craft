import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Layout, Calendar } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floral/Artsy Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100" />
      
      {/* Decorative floral patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-rose-200 to-pink-300 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-bl from-purple-200 to-pink-200 rounded-full blur-3xl translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-rose-300 to-orange-200 rounded-full blur-3xl translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-tl from-pink-200 to-rose-100 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full blur-2xl" />
      </div>

      {/* Decorative botanical elements */}
      <svg className="absolute top-10 right-10 w-32 h-32 text-rose-200/50" viewBox="0 0 100 100" fill="currentColor">
        <ellipse cx="50" cy="20" rx="15" ry="20" />
        <ellipse cx="30" cy="40" rx="12" ry="18" transform="rotate(-30 30 40)" />
        <ellipse cx="70" cy="40" rx="12" ry="18" transform="rotate(30 70 40)" />
        <ellipse cx="35" cy="65" rx="10" ry="15" transform="rotate(-20 35 65)" />
        <ellipse cx="65" cy="65" rx="10" ry="15" transform="rotate(20 65 65)" />
        <ellipse cx="50" cy="80" rx="8" ry="12" />
      </svg>

      <svg className="absolute bottom-20 left-10 w-40 h-40 text-pink-200/40" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="8" />
        <ellipse cx="50" cy="30" rx="6" ry="15" />
        <ellipse cx="50" cy="70" rx="6" ry="15" />
        <ellipse cx="30" cy="50" rx="15" ry="6" />
        <ellipse cx="70" cy="50" rx="15" ry="6" />
        <ellipse cx="35" cy="35" rx="5" ry="12" transform="rotate(-45 35 35)" />
        <ellipse cx="65" cy="35" rx="5" ry="12" transform="rotate(45 65 35)" />
        <ellipse cx="35" cy="65" rx="5" ry="12" transform="rotate(45 35 65)" />
        <ellipse cx="65" cy="65" rx="5" ry="12" transform="rotate(-45 65 65)" />
      </svg>

      <svg className="absolute top-1/3 left-5 w-24 h-24 text-purple-200/30" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 10 Q60 30 50 50 Q40 30 50 10" />
        <path d="M50 90 Q60 70 50 50 Q40 70 50 90" />
        <path d="M10 50 Q30 40 50 50 Q30 60 10 50" />
        <path d="M90 50 Q70 40 50 50 Q70 60 90 50" />
      </svg>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm text-rose-600 border border-rose-200/50 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Event Layout Designer</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">
            Design Your Perfect
            <span className="block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Event Layout
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our curated inventory, arrange items on your canvas, and
            bring your event vision to life with our intuitive layout designer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              onClick={() => navigate("/canvas")}
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 border-0"
            >
              Start Designing
              <Layout className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mb-4">
              <Layout className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Drag & Drop Canvas
            </h3>
            <p className="text-gray-600">
              Easily arrange furniture, decor, and props with intuitive
              drag-and-drop controls.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Curated Inventory
            </h3>
            <p className="text-gray-600">
              Choose from backdrops, sofas, chairs, flowers, accessories, and
              lighting options.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-rose-100 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Easy Booking
            </h3>
            <p className="text-gray-600">
              Export your layout and book your event with a simple form
              submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
