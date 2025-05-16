"use server";

import { connectDB } from "@/lib/mongodb";
import { z } from "zod";
import Contact from "@/models/contact";

const schema = z.object({
  fullname: z
    .string()
    .min(5, "Name must be larger than two characters")
    .max(50, "Name must be lesser than 50 characters"),
  email: z
    .string()
    .regex(/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/i, "Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export type FormState = {
  success: boolean;
  messages: string[];
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<{ messages: string[]; success: boolean }> {
  await connectDB();

  const fullname = formData.get("fullname") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  const result = schema.safeParse({ fullname, email, message });

  if (!result.success) {
    const messages = result.error.errors.map((err) => err.message);
    return { success: false, messages };
  }

  try {
    await Contact.create({ fullname, email, message });
    return {
      messages: ["Message sent successfully ✅"],
      success: true,
    };
  } catch (error: unknown) {
    if (isMongooseValidationError(error)) {
      const errorList = Object.values(error.errors).map(
        (e) => (e as { message: string }).message
      );
      return {
        messages: errorList,
        success: false,
      };
    }

    return {
      messages: ["Something went wrong 😕"],
      success: false,
    };
  }
}

// Type guard for Mongoose validation errors
function isMongooseValidationError(error: unknown): error is {
  name: string;
  errors: { [key: string]: { message: string } };
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "ValidationError" &&
    "errors" in error
  );
}
