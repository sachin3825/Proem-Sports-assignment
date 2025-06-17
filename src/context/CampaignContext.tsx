import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { validateStep, type CampaignFormData } from "@/lib/validation";

// Define storage key
const STORAGE_KEY = "campaign_data";

interface CampaignContextType {
  campaignData: CampaignFormData;
  updateCampaignData: (data: Partial<CampaignFormData>) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isStepValid: (step: number) => boolean;
  getValidationErrors: (step: number) => Record<string, string>;
  clearCampaignData: () => void; // 👈 New method
}

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
);

const defaultCampaignData: CampaignFormData = {
  campaignName: "",
  campaignDescription: "",
  audienceType: "all",
  customFilters: {
    platforms: [],
    country: "",
    signupDateRange: {
      from: null,
      to: null,
    },
  },
  channel: "email",
  message: "",
  scheduleType: "now",
  scheduledDate: undefined,
};

export const CampaignContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [campaignData, setCampaignData] = useState<CampaignFormData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultCampaignData;
    } catch {
      return defaultCampaignData;
    }
  });

  const [currentStep, setCurrentStep] = useState(() => {
    const step = localStorage.getItem("campaign_step");
    return step ? parseInt(step) : 1;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaignData));
  }, [campaignData]);

  useEffect(() => {
    localStorage.setItem("campaign_step", String(currentStep));
  }, [currentStep]);

  const updateCampaignData = (data: Partial<CampaignFormData>) => {
    setCampaignData((prev) => ({ ...prev, ...data }));
  };

  const clearCampaignData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCampaignData(defaultCampaignData);
    setCurrentStep(1);
  };

  const isStepValid = (step: number): boolean => {
    const validation = validateStep(step, campaignData);
    return validation.isValid;
  };

  const getValidationErrors = (step: number): Record<string, string> => {
    const validation = validateStep(step, campaignData);
    return validation.errors;
  };

  return (
    <CampaignContext.Provider
      value={{
        campaignData,
        updateCampaignData,
        currentStep,
        setCurrentStep,
        isStepValid,
        getValidationErrors,
        clearCampaignData,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
};
