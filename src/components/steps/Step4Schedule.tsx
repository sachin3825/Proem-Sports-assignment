import React from "react";
import { useCampaign } from "@/context/CampaignContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Clock, Send, AlertCircle } from "lucide-react";
import { format, addMinutes } from "date-fns";
import { cn } from "@/lib/utils";

const Step4Schedule = () => {
  const { campaignData, updateCampaignData } = useCampaign();

  const scheduleOptions = [
    {
      value: "now",
      label: "Send Now",
      description: "Send the campaign immediately after confirmation",
      icon: <Send className="w-5 h-5" />,
    },
    {
      value: "later",
      label: "Schedule Later",
      description: "Choose a specific date and time to send",
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  const handleScheduleTypeChange = (value: string) => {
    updateCampaignData({
      scheduleType: value as "now" | "later",
      scheduledDate: value === "now" ? undefined : campaignData.scheduledDate,
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // If no time is set yet, default to current time
      const currentTime = campaignData.scheduledDate || new Date();
      const newDate = new Date(date);
      newDate.setHours(currentTime.getHours());
      newDate.setMinutes(currentTime.getMinutes());
      updateCampaignData({ scheduledDate: newDate });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    if (timeValue && campaignData.scheduledDate) {
      const [hours, minutes] = timeValue.split(":").map(Number);
      const newDate = new Date(campaignData.scheduledDate);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      updateCampaignData({ scheduledDate: newDate });
    }
  };

  const isScheduledInPast =
    campaignData.scheduledDate && campaignData.scheduledDate <= new Date();
  const minTime = format(addMinutes(new Date(), 5), "HH:mm");

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-4 block">
          When would you like to send this campaign?
        </Label>
        <RadioGroup
          value={campaignData.scheduleType}
          onValueChange={handleScheduleTypeChange}
          className="space-y-3"
        >
          {scheduleOptions.map((option) => (
            <Card
              key={option.value}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {option.icon}
                      <Label
                        htmlFor={option.value}
                        className="font-medium cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">
                      {option.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      </div>

      {campaignData.scheduleType === "later" && (
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Schedule Details</h3>

            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !campaignData.scheduledDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaignData.scheduledDate ? (
                        format(campaignData.scheduledDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={campaignData.scheduledDate}
                      onSelect={handleDateChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              <div>
                <Label
                  htmlFor="time"
                  className="text-sm font-medium mb-2 block"
                >
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={
                    campaignData.scheduledDate
                      ? format(campaignData.scheduledDate, "HH:mm")
                      : ""
                  }
                  onChange={handleTimeChange}
                  min={
                    campaignData.scheduledDate &&
                    format(campaignData.scheduledDate, "yyyy-MM-dd") ===
                      format(new Date(), "yyyy-MM-dd")
                      ? minTime
                      : undefined
                  }
                />
              </div>

              {isScheduledInPast && (
                <div className="flex items-center space-x-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4" />
                  <span>Scheduled time must be in the future</span>
                </div>
              )}

              {campaignData.scheduledDate && !isScheduledInPast && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 text-blue-900">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Scheduled for:</span>
                  </div>
                  <p className="text-blue-800 mt-1">
                    {format(
                      campaignData.scheduledDate,
                      "EEEE, MMMM do, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Step4Schedule;
