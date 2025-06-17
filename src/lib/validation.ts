import { z } from "zod";

export const campaignSchema = z.object({
  // step 1
  campaignName: z
    .string()
    .trim()
    .min(1, "Campaign name is required")
    .max(100, "Campaign name must be less than 100 characters"),
  campaignDescription: z
    .string()
    .trim()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  // step 2
  audienceType: z.enum(["all", "new", "inactive", "custom"]),
  customFilters: z
    .object({
      platforms: z.array(z.string()).optional(),
      country: z.string().optional(),
      signupDateRange: z
        .object({
          from: z.date().nullable(),
          to: z.date().nullable(),
        })
        .refine(
          (range) => !range?.from || !range?.to || range.from < range.to,
          {
            message: '"From" date must be earlier than "To" date',
            path: ["from"],
          }
        )
        .optional(),
    })
    .optional(),

  // Step 3
  channel: z.enum(["email", "whatsapp", "sms"]),
  message: z
    .string()
    .min(1, "Message is required")
    .max(4096, "Message is too long"),

  // Step 4
  scheduleType: z.enum(["now", "later"]),
  scheduledDate: z.date().optional(),
});

export type CampaignFormData = z.infer<typeof campaignSchema>;

// Helper functions for validation
export const validateStep = (step: number, data: any) => {
  try {
    switch (step) {
      case 1:
        campaignSchema
          .pick({ campaignName: true, campaignDescription: true })
          .parse(data);
        return { isValid: true, errors: {} };
      case 2:
        campaignSchema.pick({ audienceType: true }).parse(data);

        if (data.audienceType === "custom") {
          campaignSchema.pick({ customFilters: true }).parse(data);

          const hasPlatform =
            Array.isArray(data.customFilters?.platforms) &&
            data.customFilters.platforms.length > 0;
          const hasCountry = !!data.customFilters?.country;
          const hasDateRange =
            !!data.customFilters?.signupDateRange?.from &&
            !!data.customFilters?.signupDateRange?.to;

          if (!hasPlatform && !hasCountry && !hasDateRange) {
            return {
              isValid: false,
              errors: {
                customFilters:
                  "At least one custom filter (Platform, Country, or Date Range) is required",
              },
            };
          }
        }

        return { isValid: true, errors: {} };

        campaignSchema.pick({ audienceType: true }).parse(data);
        return { isValid: true, errors: {} };
      case 3:
        campaignSchema.pick({ channel: true, message: true }).parse(data);
        return { isValid: true, errors: {} };
      case 4:
        if (
          data.scheduleType === "later" &&
          (!data.scheduledDate || data.scheduledDate <= new Date())
        ) {
          return {
            isValid: false,
            errors: { scheduledDate: "Please select a future date" },
          };
        }
        campaignSchema.pick({ scheduleType: true }).parse(data);
        return { isValid: true, errors: {} };
      default:
        return { isValid: true, errors: {} };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path.join(".")] = err.message;
        return acc;
      }, {} as Record<string, string>);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: "Validation failed" } };
  }
};
