import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Download, Calendar, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Export = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedImage = sessionStorage.getItem("exportedCanvas");
    if (savedImage) {
      setImageUrl(savedImage);
    } else {
      toast.error("No exported layout found");
      navigate("/canvas");
    }
  }, [navigate]);

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement("a");
    link.download = `event-layout-${Date.now()}.png`;
    link.href = imageUrl;
    link.click();
    toast.success("Layout downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/canvas")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Canvas
            </Button>
            <h1 className="text-4xl font-bold mb-2">Your Event Layout</h1>
            <p className="text-muted-foreground">
              Review your design and proceed to booking
            </p>
          </div>

          {/* Exported Image */}
          {imageUrl && (
            <div className="bg-card border rounded-xl p-6 mb-8 shadow-lg">
              <img
                src={imageUrl}
                alt="Exported Layout"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={handleDownload}
              className="flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Layout
            </Button>
            
            <Button
              size="lg"
              onClick={() => navigate("/booking")}
              className="flex-1 sm:flex-none shadow-lg"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Proceed to Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Export;
