import { z } from "zod"
// Recursive definition for UI Component
export const Z_UI_Component: z.ZodType<any> = z.lazy(() =>
	z.object({
		id: z.string(), // Required id
		type: z.string(), // e.g., div, button
		props: z
			.object({
				className: z.string().optional(),
				style: z.record(z.any().optional(),z.any()).optional(), // React.CSSProperties → allow any key-value
				onClick: z.string().optional(),
			})
			.catchall(z.any())
			.optional(),
		children: z.array(z.union([Z_UI_Component, z.string()])).optional(),
		query: z.object({
			id: z.string().optional(), // GraphQL query ID
			graphql: z.string().optional(), // GraphQL query
			vars: z.record(z.any().optional(),z.any()).optional(), // GraphQL variables
		}).optional(),
		dataPath: z.string().optional(),  // Path to data (e.g., "users", "posts.0.title")
		binding: z.string().optional(),   // Data binding (e.g., "users", "posts")
	})
)
export type T_UI_Component = z.infer<typeof Z_UI_Component>

// UISchema definition (if needed in DB)
export const UISchemaSchema = z.object({
	id: z.string(),
	userId: z.string(),
	uiId: z.string(),
	name: z.string(),
	component: Z_UI_Component,
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type T_UI_Schema = z.infer<typeof UISchemaSchema>