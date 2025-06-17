import React from "react";
import { useCampaign } from "@/context/CampaignContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Users,
  Smartphone,
  Globe,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Step2AudienceSegment = () => {
  const { campaignData, updateCampaignData } = useCampaign();

  const audienceOptions = [
    {
      value: "all",
      label: "All Users",
      description: "Target all users in your database",
      icon: <Users className="w-5 h-5" />,
    },
    {
      value: "new",
      label: "New Users",
      description: "Users who signed up in the last 7 days",
      icon: <Users className="w-5 h-5" />,
    },
    {
      value: "inactive",
      label: "Inactive Users",
      description: "Users with no activity in the last 30 days",
      icon: <Users className="w-5 h-5" />,
    },
    {
      value: "custom",
      label: "Custom Segment",
      description: "Define your own targeting criteria",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const platforms = [
    {
      id: "web",
      label: "Web",
      icon: <Globe className="w-4 h-4" />,
      color: "bg-blue-500",
      description: "Desktop & mobile web users",
    },
    {
      id: "android",
      label: "Android",
      icon: <Smartphone className="w-4 h-4" />,
      color: "bg-green-500",
      description: "Android app users",
    },
    {
      id: "ios",
      label: "iOS",
      icon: <Smartphone className="w-4 h-4" />,
      color: "bg-gray-800",
      description: "iPhone & iPad app users",
    },
  ];

  const handleAudienceTypeChange = (value: string) => {
    updateCampaignData({
      audienceType: value as "all" | "new" | "inactive" | "custom",
      customFilters:
        value === "custom"
          ? {
              platforms: [],
              country: "",
              signupDateRange: {
                from: null,
                to: null,
              },
            }
          : {
              platforms: [],
              country: "",
              signupDateRange: {
                from: null,
                to: null,
              },
            },
    });
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    const currentPlatforms = campaignData.customFilters?.platforms || [];
    const newPlatforms = checked
      ? [...currentPlatforms, platformId]
      : currentPlatforms.filter((p) => p !== platformId);

    updateCampaignData({
      customFilters: {
        platforms: newPlatforms,
        country: campaignData.customFilters?.country || "",
        signupDateRange: campaignData.customFilters?.signupDateRange || {
          from: null,
          to: null,
        },
      },
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCampaignData({
      customFilters: {
        platforms: campaignData.customFilters?.platforms || [],
        country: e.target.value,
        signupDateRange: campaignData.customFilters?.signupDateRange || {
          from: null,
          to: null,
        },
      },
    });
  };

  const handleDateRangeChange = (
    field: "from" | "to",
    date: Date | undefined
  ) => {
    updateCampaignData({
      customFilters: {
        platforms: campaignData.customFilters?.platforms || [],
        country: campaignData.customFilters?.country || "",
        signupDateRange: {
          from:
            field === "from"
              ? date || null
              : campaignData.customFilters?.signupDateRange?.from || null,
          to:
            field === "to"
              ? date || null
              : campaignData.customFilters?.signupDateRange?.to || null,
        },
      },
    });
  };

  const getSelectedPlatformsText = () => {
    const selectedPlatforms = campaignData.customFilters?.platforms || [];
    if (selectedPlatforms.length === 0) return "Select platforms...";
    if (selectedPlatforms.length === 1) {
      const platform = platforms.find((p) => p.id === selectedPlatforms[0]);
      return platform?.label || "";
    }
    return `${selectedPlatforms.length} platforms selected`;
  };

  const getSelectedPlatforms = () => {
    const selectedPlatforms = campaignData.customFilters?.platforms || [];
    return platforms.filter((p) => selectedPlatforms.includes(p.id));
  };

  // Check if date range is valid
  const isDateRangeValid = () => {
    const fromDate = campaignData.customFilters?.signupDateRange?.from;
    const toDate = campaignData.customFilters?.signupDateRange?.to;

    if (!fromDate || !toDate) return true; // If either is null, no validation needed
    return fromDate <= toDate;
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-4 block">
          Select your target audience
        </Label>
        <RadioGroup
          value={campaignData.audienceType}
          onValueChange={handleAudienceTypeChange}
          className="space-y-3"
        >
          {audienceOptions.map((option) => (
            <div key={option.value}>
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary/50"
                onClick={() => handleAudienceTypeChange(option.value)}
              >
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {option.icon}
                        <Label
                          htmlFor={option.value}
                          className="font-medium cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {option.label}
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-7">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </RadioGroup>
      </div>

      {campaignData.audienceType === "custom" && (
        <Card className="animate-fade-in border-2 border-dashed border-primary/20">
          <CardContent className="px-6">
            <h3 className="font-medium mb-4 flex items-center space-x-2">
              <span>Custom Targeting Filters</span>
            </h3>

            <div className="space-y-6">
              {/* Enhanced Platform Multi-Select */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Platform
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-auto p-3 hover:bg-accent/50"
                    >
                      <div className="flex items-center space-x-2">
                        {getSelectedPlatforms().length > 0 ? (
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1">
                              {getSelectedPlatforms()
                                .slice(0, 3)
                                .map((platform) => (
                                  <div
                                    key={platform.id}
                                    className={`w-6 h-6 rounded-full ${platform.color} flex items-center justify-center text-white text-xs border-2 border-background`}
                                  >
                                    {platform.icon}
                                  </div>
                                ))}
                            </div>
                            <span className="text-sm">
                              {getSelectedPlatformsText()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Select platforms...
                          </span>
                        )}
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 bg-background border shadow-lg">
                    <div className="p-2">
                      <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                        Select target platforms
                      </div>
                      {platforms.map((platform) => {
                        const isSelected =
                          campaignData.customFilters?.platforms?.includes(
                            platform.id
                          ) || false;

                        return (
                          <div
                            key={platform.id}
                            className="py-3 px-2 hover:bg-accent rounded-md cursor-pointer flex items-center space-x-3 w-full"
                            onClick={() =>
                              handlePlatformChange(platform.id, !isSelected)
                            }
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <div
                                className={`w-8 h-8 rounded-lg ${platform.color} flex items-center justify-center text-white`}
                              >
                                {platform.icon}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {platform.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {platform.description}
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Country Selection */}
              <div>
                <Label
                  htmlFor="country"
                  className="text-sm font-medium mb-2 block"
                >
                  Country
                </Label>
                <Input
                  id="country"
                  placeholder="Enter country name "
                  value={campaignData.customFilters?.country || ""}
                  onChange={handleCountryChange}
                  className="focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Signup Date Range */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Signup Date Range
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      From
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !campaignData.customFilters?.signupDateRange
                              ?.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {campaignData.customFilters?.signupDateRange?.from ? (
                            format(
                              campaignData.customFilters.signupDateRange.from,
                              "PPP"
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            campaignData.customFilters?.signupDateRange?.from ||
                            undefined
                          }
                          onSelect={(date) =>
                            handleDateRangeChange("from", date)
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      To
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !campaignData.customFilters?.signupDateRange?.to &&
                              "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {campaignData.customFilters?.signupDateRange?.to ? (
                            format(
                              campaignData.customFilters.signupDateRange.to,
                              "PPP"
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            campaignData.customFilters?.signupDateRange?.to ||
                            undefined
                          }
                          onSelect={(date) => handleDateRangeChange("to", date)}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Date Range Validation Error */}
                {!isDateRangeValid() && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      The "from" date must be before or equal to the "to" date.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Step2AudienceSegment;
