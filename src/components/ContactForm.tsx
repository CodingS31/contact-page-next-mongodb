"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useActionState, useState } from "react";
import { submitContactForm } from "@/actions/contactAction";

const initialState = {
  messages: [] as string[],
  success: false,
};

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { pending } = useFormStatus();

  // Controlled inputs
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (state.success) {
      const form = document.getElementById("contact-form") as HTMLFormElement;
      form?.reset(); // reset input values
      setFullname("");
      setEmail("");
      setMessage("");
    }
  }, [state.success]);

  return (
    <>
      <form
        id="contact-form"
        action={formAction}
        className="py-4 mt-4 border-t flex flex-col gap-5"
      >
        <div>
          <label htmlFor="fullname">Full Name</label>
          <input
            name="fullname"
            type="text"
            id="fullname"
            placeholder="John Doe"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="px-6 py-2 border border-slate-300 shadow-md"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="text"
            id="email"
            placeholder="john@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-6 py-2 border border-slate-300 shadow-md"
          />
        </div>

        <div>
          <label htmlFor="message">Your Message</label>
          <textarea
            name="message"
            id="message"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-32 px-6 py-2 border border-slate-300 shadow-md"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-green-700 p-3 text-white font-bold"
          disabled={pending}
        >
          {pending ? "Sending..." : "Send"}
        </button>
      </form>

      {state.messages.length > 0 && (
        <div className="bg-slate-100 flex flex-col">
          {state.messages.map((m: string, i: number) => (
            <div
              key={i}
              className={`${
                state.success ? "text-green-800" : "text-red-600"
              } px-5 py-2`}
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
