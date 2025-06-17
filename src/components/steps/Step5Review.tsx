import { useCampaign } from "@/context/CampaignContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Edit,
  Users,
  MessageSquare,
  Clock,
  Send,
  Mail,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";

const Step5Review = () => {
  const { campaignData, setCurrentStep, clearCampaignData } = useCampaign();

  const handleSubmit = () => {
    // Simulate campaign submission
    toast(
      <div>
        <div className="font-semibold">🎉 Campaign Created Successfully!</div>
        <div>
          "{campaignData.campaignName}" has been{" "}
          {campaignData.scheduleType === "now" ? "sent" : "scheduled"}.
        </div>
      </div>,
      { duration: 5000 }
    );

    localStorage.setItem(
      "lastCampaign",
      JSON.stringify({
        ...campaignData,
        createdAt: new Date().toISOString(),
        status: campaignData.scheduleType === "now" ? "sent" : "scheduled",
      })
    );

    localStorage.removeItem("campaign_step");
    setCurrentStep(1);
    clearCampaignData();
  };

  const getAudienceDescription = () => {
    switch (campaignData.audienceType) {
      case "all":
        return "All Users";
      case "new":
        return "New Users (last 7 days)";
      case "inactive":
        return "Inactive Users (last 30 days)";
      case "custom":
        const filters = [];
        if (campaignData.customFilters?.platforms?.length) {
          filters.push(
            `Platforms: ${campaignData.customFilters.platforms?.join(", ")}`
          );
        }
        if (campaignData.customFilters?.country) {
          filters.push(`Country: ${campaignData.customFilters.country}`);
        }
        if (
          campaignData.customFilters?.signupDateRange?.from ||
          campaignData.customFilters?.signupDateRange?.to
        ) {
          const from = campaignData.customFilters.signupDateRange?.from;
          const to = campaignData.customFilters.signupDateRange?.to;
          filters.push(
            `Signup: ${from ? format(from, "MMM dd, yyyy") : "Any"} - ${
              to ? format(to, "MMM dd, yyyy") : "Any"
            }`
          );
        }
        return filters.length
          ? `Custom Segment (${filters.join("; ")})`
          : "Custom Segment";
      default:
        return "Unknown";
    }
  };

  const getChannelIcon = () => {
    switch (campaignData.channel) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "whatsapp":
        return <MessageSquare className="w-4 h-4" />;
      case "sms":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const renderMessagePreview = () => {
    const previewMessage =
      campaignData.message.length > 100
        ? campaignData.message.substring(0, 100) + "..."
        : campaignData.message;
    return previewMessage;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Review Your Campaign
        </h2>
        <p className="text-gray-600">
          Please review all details before submitting your campaign.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Campaign Info */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Campaign Information</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
                className="flex items-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {campaignData.campaignName}
              </div>
              {campaignData.campaignDescription && (
                <div>
                  <span className="font-medium">Description:</span>{" "}
                  <div className="whitespace-pre-wrap break-words overflow-auto">
                    {campaignData.campaignDescription}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Audience */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Target Audience</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(2)}
                className="flex items-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Badge
              variant="secondary"
              className="whitespace-pre-wrap break-words overflow-auto"
            >
              {getAudienceDescription()}
            </Badge>
          </CardContent>
        </Card>

        {/* Message */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                {getChannelIcon()}
                <span>Message ({campaignData.channel.toUpperCase()})</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(3)}
                className="flex items-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <div className="whitespace-pre-wrap break-words overflow-auto">
                {renderMessagePreview()}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {campaignData.message.length} characters
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Schedule</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(4)}
                className="flex items-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {campaignData.scheduleType === "now" ? (
              <Badge variant="default">Send Immediately</Badge>
            ) : (
              <div className="space-y-1">
                <Badge variant="outline">Scheduled</Badge>
                <div className="text-sm text-gray-600">
                  {campaignData.scheduledDate &&
                    format(
                      campaignData.scheduledDate,
                      "EEEE, MMMM do, yyyy 'at' h:mm a"
                    )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Submit Button */}
      <div className="text-center space-y-4">
        <Button
          onClick={handleSubmit}
          size="lg"
          className="px-8 py-3 text-lg font-medium"
        >
          <Send className="w-5 h-5 mr-2" />
          {campaignData.scheduleType === "now"
            ? "Send Campaign Now"
            : "Schedule Campaign"}
        </Button>

        <p className="text-sm text-gray-500">
          {campaignData.scheduleType === "now"
            ? "Your campaign will be sent immediately after confirmation."
            : "Your campaign will be sent at the scheduled time."}
        </p>
      </div>
    </div>
  );
};

export default Step5Review;
