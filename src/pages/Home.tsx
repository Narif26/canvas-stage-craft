import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Layout, Calendar } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Event Layout Designer</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Design Your Perfect
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Event Layout
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our curated inventory, arrange items on your canvas, and bring your event vision to life with our intuitive layout designer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              onClick={() => navigate("/inventory")}
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Start Designing
              <Layout className="ml-2 w-5 h-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/inventory")}
              className="text-lg px-8 py-6"
            >
              Browse Inventory
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
          <div className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Layout className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Drag & Drop Canvas</h3>
            <p className="text-muted-foreground">
              Easily arrange furniture, decor, and props with intuitive drag-and-drop controls.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Curated Inventory</h3>
            <p className="text-muted-foreground">
              Choose from backdrops, sofas, chairs, flowers, props, and lighting options.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
            <p className="text-muted-foreground">
              Export your layout and book your event with a simple form submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
