import { createContext, useContext, useState, ReactNode } from "react";

interface AiResultsContextType {
  aiImages: string[];
  setAiImages: (images: string[]) => void;
  clearAiImages: () => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

const AiResultsContext = createContext<AiResultsContextType | undefined>(undefined);

export const AiResultsProvider = ({ children }: { children: ReactNode }) => {
  const [aiImages, setAiImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const clearAiImages = () => setAiImages([]);

  return (
    <AiResultsContext.Provider
      value={{ aiImages, setAiImages, clearAiImages, isGenerating, setIsGenerating }}
    >
      {children}
    </AiResultsContext.Provider>
  );
};

export const useAiResults = () => {
  const context = useContext(AiResultsContext);
  if (!context) {
    throw new Error("useAiResults must be used within AiResultsProvider");
  }
  return context;
};
