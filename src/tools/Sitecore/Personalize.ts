import { CreateExperienceSchema } from "sitecore-personalize-tenant-sdk";

const jsonSchema = CreateExperienceSchema;

export const PersonalizeTool = {
  type: "function" as const,
  function: {
    name: "create_personalization_experience",
    type: "function",
    description:
      "Creates a new personalization experience in Sitecore Personalize.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the personalization experience.",
        },
        friendlyId: {
          type: "string",
          description:
            "A friendly identifier for the experience that can be generated from the name, using a regex pattern of ^[a-z0-9_]*$.",
        },
        type: {
          type: "string",
          enum: ["Web", "API", "Triggered"],
          description: "The type of the experience.",
        },
        channels: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "Call Center",
              "Email",
              "Mobile App",
              "Mobile Web",
              "Web",
              "SMS",
            ],
          },
          description: "The channels for the experience.",
        },
      },
      required: ["name", "type", "channels"],
    },
    function: createPersonalizationExperience,
    parse: JSON.parse,
  },
};

async function createPersonalizationExperience(args: { params: any }) {
  console.log("Creating personalization experience:", args.params);
  return {
    status: "success",
    message: "Personalization experience created successfully.",
  };
}
