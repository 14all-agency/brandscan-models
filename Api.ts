/**
 * API request schemas and parsers.
 * Each section corresponds to a specific endpoint and defines:
 * - Zod schema (shared FE/BE)
 * - inferred TypeScript type
 * - backend parser for raw request bodies
 */

import { z } from "zod";
import { FiltersSchema } from "./RedditSearch";

//
// ======================================================
// UPDATE ORG (POST /shopify/updateOrg)
// ======================================================
//

/**
 * Request body for updating organisation fields.
 */
export const UpdateOrgBodySchema = z.object({
  contactEmail: z
    .string()
    .trim()
    .refine((value) => value.includes("@") && value.includes("."), {
      message: "Request body is not valid",
    })
    .optional(),
});

export type UpdateOrgBody = z.infer<typeof UpdateOrgBodySchema>;

/**
 * Parses and validates raw request body for updateOrg endpoint.
 */
export function parseUpdateOrgBody(body: string | null | undefined): UpdateOrgBody {
  if (!body) {
    return {};
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(body);
  } catch {
    throw new Error("Request body is not valid");
  }

  const parsed = UpdateOrgBodySchema.safeParse(parsedJson);

  if (!parsed.success) {
    throw new Error("Request body is not valid");
  }

  return parsed.data;
}

//
// ======================================================
// UPDATE SUBSCRIPTION (POST /redditSearch/updateSubscription)
// ======================================================
//

/**
 * Request body for subscribing/unsubscribing to a Reddit search.
 */
export const UpdateSubscriptionBodySchema = z
  .object({
    searchId: z.string().min(1),
    frequency: z.union([z.literal("daily"), z.literal("weekly")]).optional(),
    disabled: z.boolean(),
  })
  .superRefine((value, ctx) => {
    // If enabling a subscription, frequency must be provided.
    if (value.disabled !== true && !value.frequency) {
      ctx.addIssue({
        code: "custom",
        path: ["frequency"],
        message: "Frequency is not valid",
      });
    }
  });

export type UpdateSubscriptionBody = z.infer<typeof UpdateSubscriptionBodySchema>;

/**
 * Parses and validates raw request body for updateSubscription endpoint.
 */
export function parseUpdateSubscriptionBody(
  body: string | null | undefined,
): UpdateSubscriptionBody {
  if (!body) {
    throw new Error("Request body is not valid");
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(body);
  } catch {
    throw new Error("Request body is not valid");
  }

  const parsed = UpdateSubscriptionBodySchema.safeParse(parsedJson);

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues.map((issue) => issue.message).join(", ") ||
        "Request body is not valid",
    );
  }

  return parsed.data;
}

//
// ======================================================
// CREATE SEARCH (POST /redditSearch/createSearch)
// ======================================================
//

/**
 * Request body for creating a new Reddit search.
 */
export const CreateSearchBodySchema = z.object({
  input: z.string().min(1),
  filters: FiltersSchema,
});

export type CreateSearchBody = z.infer<typeof CreateSearchBodySchema>;

/**
 * Parses and validates raw request body for createSearch endpoint.
 */
export function parseCreateSearchBody(body: string | null | undefined): CreateSearchBody {
  if (!body) {
    throw new Error("Request body is not valid");
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(body);
  } catch {
    throw new Error("Request body is not valid");
  }

  const parsed = CreateSearchBodySchema.safeParse(parsedJson);

  if (!parsed.success) {
    throw new Error(
      `Request body is not valid: ${parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ")}`,
    );
  }

  return parsed.data;
}