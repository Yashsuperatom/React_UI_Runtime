import { z } from "zod";

/** NodeType */
export const NodeTypeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z.string(),
    props: z.record(z.string(), z.any()).optional(),
    children: z.union([
      z.string(),
      NodeTypeSchema, // recursive
      z.array(z.union([z.string(), NodeTypeSchema])),
    ]).optional(),
  })
);
export type NodeType = z.infer<typeof NodeTypeSchema>;

/** MessagePart */
export const MessageStateSchema = z.enum([
  "streaming",
  "done",
  "input-streaming",
  "output-available",
  "output-error",
]);

export const MessagePartSchema = z.object({
  type: z.literal("text"),
  text: z.any().optional(),
  state: MessageStateSchema.optional(),
  errorText: z.string().optional(),
});
export type MessagePart = z.infer<typeof MessagePartSchema>;

/** ChatMessage */
export const RoleSchema = z.enum(["system", "user", "assistant"]);

export const ChatMessageSchema = z.object({
  id: z.any().optional(),
  parts: z.array(MessagePartSchema).optional(),
  timestamp: z.date().optional(),
  schema: z.any().optional(),
  role: RoleSchema,
  showLogs: z.boolean().optional(),
  isUILog: z.boolean().optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/** ChatConfig */
export const ChatConfigSchema = z.object({
  maxLength: z.number().optional(),
  placeholder: z.string().optional(),
  enableVoice: z.boolean().optional(),
  enableAttachments: z.boolean().optional(),
  enablePrompts: z.boolean().optional(),
  modelName: z.string().optional(),
  onError: z.function().optional(),

});
export type ChatConfig = z.infer<typeof ChatConfigSchema>;

/** ChatHandlers */
export const ChatHandlersSchema = z.record(
  z.string(),
  z.function()
);
export type ChatHandlers = z.infer<typeof ChatHandlersSchema>;