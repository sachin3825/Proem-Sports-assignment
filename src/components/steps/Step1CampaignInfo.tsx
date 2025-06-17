import React from "react";
import { useCampaign } from "@/context/CampaignContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

const Step1CampaignInfo = () => {
  const { campaignData, updateCampaignData } = useCampaign();
  const [isNameTouched, setIsNameTouched] = React.useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNameTouched) setIsNameTouched(true);
    updateCampaignData({ campaignName: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateCampaignData({ campaignDescription: e.target.value });
  };

  const showNameError =
    isNameTouched && campaignData.campaignName.trim() === "";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="campaignName" className="text-base font-medium">
          Campaign Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="campaignName"
          type="text"
          placeholder="Enter campaign name"
          value={campaignData.campaignName}
          onChange={handleNameChange}
          className={`${
            showNameError
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : ""
          }`}
        />
        {showNameError && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Campaign name is required</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="campaignDescription" className="text-base font-medium">
          Campaign Description
        </Label>
        <Textarea
          id="campaignDescription"
          placeholder="Describe your campaign (optional)"
          value={campaignData.campaignDescription}
          onChange={handleDescriptionChange}
          rows={4}
          className="resize-none"
        />
        <p className="text-sm text-gray-500">
          Add a brief description to help you remember what this campaign is
          about.
        </p>
      </div>
    </div>
  );
};

export default Step1CampaignInfo;
