import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { validateStep, type CampaignFormData } from "@/lib/validation";

interface CampaignContextType {
  campaignData: CampaignFormData;
  updateCampaignData: (data: Partial<CampaignFormData>) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isStepValid: (step: number) => boolean;
  getValidationErrors: (step: number) => Record<string, string>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
);

const initialCampaignData: CampaignFormData = {
  campaignName: "",
  campaignDescription: "",
  audienceType: "all",
  customFilter: {
    platform: [],
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
  const [campaignData, setCampaignData] =
    useState<CampaignFormData>(initialCampaignData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateCampaignData = (data: Partial<CampaignFormData>) => {
    setCampaignData((prev) => ({ ...prev, ...data }));
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
