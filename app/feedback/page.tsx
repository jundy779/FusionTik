export default function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Feedback</h1>
      <p className="text-muted-foreground">
        We value your feedback!  Use the form below to send us suggestions, report bugs, or share your
        experience using SlowTik.  Your input helps us improve the service for
        everyone.
      </p>
      {/* The form below is a placeholder; in a real application you would handle submissions appropriately */}
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="mt-1 block w-full border border-border rounded-md px-3 py-2 bg-background"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            placeholder="Enter your feedback here..."
            className="mt-1 block w-full border border-border rounded-md px-3 py-2 bg-background"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled
          className="bg-gray-500 text-white px-4 py-2 rounded-md opacity-60 cursor-not-allowed"
          title="Form submission is disabled in this demo"
        >
          Submit
        </button>
      </form>
      <p className="text-sm text-muted-foreground">
        Note: This form is non-functional in the demo environment.  To contact us directly, please send an
        email to <a href="mailto:support@example.com" className="underline">support@example.com</a>.
      </p>
    </div>
  )
}