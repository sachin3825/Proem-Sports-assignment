import { useCampaign } from "@/context/CampaignContext";
import { Progress } from "./ui/progress";
import Step1CampaignInfo from "./steps/Step1CampaignInfo";
import Step2AudienceSegment from "./steps/Step2AudienceSegment";
import Step3MessageEditor from "./steps/Step3MessageEditor";
import Step4Schedule from "./steps/Step4Schedule";
import Step5Review from "./steps/Step5Review";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STEPS = [
  { number: 1, title: "Campaign Info", component: Step1CampaignInfo },
  { number: 2, title: "Audience", component: Step2AudienceSegment },
  { number: 3, title: "Message", component: Step3MessageEditor },
  { number: 4, title: "Schedule", component: Step4Schedule },
  { number: 5, title: "Review", component: Step5Review },
];

const CampaignBuilder = () => {
  const { currentStep, setCurrentStep, isStepValid } = useCampaign();

  const handleNext = () => {
    if (currentStep < 5 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Campaign Builder
          </h1>
        </div>

        {/* progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className={`flex items-center space-x-2 ${
                  step.number <= currentStep ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.number < currentStep
                      ? "bg-blue-600 text-white"
                      : step.number === currentStep
                      ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.number}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* step content */}
        <Card className="mb-8 shadow-lg p-0">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 p-0">
                Step {currentStep} : {STEPS[currentStep - 1].title}
              </h2>
            </div>
            <div className="animate-fade-in">
              <CurrentStepComponent />
            </div>
          </CardContent>
        </Card>

        {/* navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant={"outline"}
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {STEPS.length}
          </div>
          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilder;
