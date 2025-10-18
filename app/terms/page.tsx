export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-muted-foreground mb-4">
        These Terms of Service govern your use of SlowTik. By accessing or using the
        service, you agree to be bound by these terms. The service is provided for personal, non-commercial
        use only. You may not use the downloaded content for commercial purposes without obtaining the
        appropriate permissions from the content creator.
      </p>
      <p className="text-muted-foreground mb-4">
        We do not host any TikTok content on our servers. All content is fetched directly from TikTok. We
        reserve the right to terminate or suspend access to our service immediately, without prior notice,
        for conduct that we believe violates these Terms.
      </p>
      <p className="text-muted-foreground">
        For more information about how we handle your data, please read our Privacy Policy.
      </p>
    </div>
  )
}