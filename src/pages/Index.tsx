import CampaignBuilder from "@/components/CampaignBuilder";
import { CampaignContextProvider } from "@/context/CampaignContext";

const Index = () => {
  return (
    <CampaignContextProvider>
      <CampaignBuilder />
    </CampaignContextProvider>
  );
};

export default Index;
