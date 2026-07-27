import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { type SingleValue } from "react-select";
import { InputField, SelectField } from "@/components/common";
import leadsService from "@/features/leads/leads-service";
import type { PublicLeadPayload } from "@/features/leads";
import { errorToast } from "@/shared/services/toast-service";

type SourceOption = {
  value: NonNullable<PublicLeadPayload["source"]>;
  label: string;
};

const SOURCE_OPTIONS: SourceOption[] = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "event", label: "Event" },
  { value: "other", label: "Other" },
];

const LeadCapture = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SourceOption | null>(
    SOURCE_OPTIONS[0],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PublicLeadPayload>({
    defaultValues: { source: "website" },
  });

  const handleSourceChange = (option: SingleValue<SourceOption>) => {
    setSelectedSource(option);
    setValue("source", option?.value ?? undefined, { shouldValidate: true });
  };

  const onSubmit = async (data: PublicLeadPayload) => {
    setSubmitting(true);
    try {
      await leadsService.createPublic(data);
      setSubmitted(true);
      reset({ source: "website" });
      setSelectedSource(SOURCE_OPTIONS[0]);
    } catch (error: any) {
      errorToast(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full lg:w-1/2 max-w-lg lg:pr-12 mb-8 lg:mb-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-lg">
              LF
            </div>
            <span className="text-2xl font-bold">
              Lead
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Flow
              </span>
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Connect with our team
            </h1>
            <p className="text-lg text-slate-600">
              Share your details and we'll get back to you shortly to discuss
              how we can help.
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 flex-shrink-0 mt-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Fast response</p>
                <p className="text-sm text-slate-600">
                  Our team typically responds within 24 hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 flex-shrink-0 mt-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Secure & private</p>
                <p className="text-sm text-slate-600">
                  Your information is protected with enterprise-grade security
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 flex-shrink-0 mt-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900">No commitment</p>
                <p className="text-sm text-slate-600">
                  Just an initial conversation to see if we're a good fit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-6">
          {submitted ? (
            <div className="space-y-6 text-center py-8">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  Thank you!
                </h2>
                <p className="text-slate-600">
                  Your inquiry has been received. Our team will review your
                  details and reach out shortly.
                </p>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition inline-block"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  Let's talk
                </h2>
                <p className="text-slate-600 text-sm">
                  Fill out the form below and we'll be in touch.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-4">
                  <InputField
                    label="Full Name"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Jane Doe"
                    register={register}
                    rules={{ required: "Name is required" }}
                    error={errors.name?.message}
                    required
                  />

                  <InputField
                    label="Work Email"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@company.com"
                    register={register}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    error={errors.email?.message}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Phone"
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 000-0000"
                    register={register}
                  />
                  <InputField
                    label="Company"
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Your company"
                    register={register}
                  />
                </div>

                {/* How you heard */}
                <SelectField
                  label="How did you hear about us?"
                  name="source"
                  value={selectedSource}
                  options={SOURCE_OPTIONS}
                  onChange={handleSourceChange}
                  placeholder="Select an option"
                  required
                />

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-900 mb-2"
                  >
                    Tell us more
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="What are you looking for? How can we help..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none placeholder-slate-500 bg-white"
                    {...register("message")}
                  />
                  <p className="text-xs text-slate-500 mt-1.5">Optional</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-white text-sm font-semibold shadow-md transition duration-200 ${
                    submitting
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  }`}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Connect with us
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          Already part of the team?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LeadCapture;
