export default {
  type: "object",
  properties: {
    message: { type: "string" },
    context: { type: "number" },
    type: { type: "string" },
  },
  required: ["message"],
} as const;
