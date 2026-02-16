import React from "react";

const LegalPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      <h1 className="text-3xl font-bold mb-8 text-center">Legal Information</h1>

      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-8 border border-gray-100 dark:border-dark-border space-y-8">
        {/* Terms and Conditions Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-300 border-b pb-2 border-gray-200 dark:border-gray-700">
            Terms and Conditions
          </h2>

          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing and using Zerely ("the Platform"), you accept and
              agree to be bound by the terms and provision of this agreement.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              2. User Responsibility
            </h3>
            <p>
              You are solely responsible for the content you post. The Platform
              acts as a passive conduit for the online distribution and
              publication of user-submitted information. You agree not to post
              content that:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Is unlawful, harmful, threatening, abusive, harassing,
                defamatory, or invasive of another's privacy.
              </li>
              <li>Promotes self-harm, violence, or illegal acts.</li>
              <li>
                Contains personal information of others without their consent.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              3. Disclaimer of Liability
            </h3>
            <p>
              The Platform is provided on an "AS IS" basis. The creators and
              administrators of Zerely are <strong>not responsible</strong> for
              any content posted by users. We do not guarantee the accuracy,
              integrity, or quality of any content. You understand that by using
              the Platform, you may be exposed to content that is offensive or
              objectionable.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              4. Content Moderation & Termination
            </h3>
            <p>
              We reserve the right to remove any content and terminate user
              accounts for any reason, including but not limited to valid legal
              requests or violations of these terms.
            </p>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-300 border-b pb-2 border-gray-200 dark:border-gray-700">
            Privacy Policy
          </h2>

          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              1. Information We Collect
            </h3>
            <p>
              While we prioritize anonymity, we collect certain information to
              maintain the security and legal compliance of the Platform:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Email Address:</strong> Used for account recovery and
                authentication only. Not displayed publicly.
              </li>
              <li>
                <strong>IP Address:</strong> Logged securely with posts for
                content liability and spam prevention. Not displayed publicly.
              </li>
              <li>
                <strong>Usage Data:</strong> Timestamps of posts and
                interactions.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              2. Anonymity
            </h3>
            <p>
              Your "Anonymous Name" is the only identifier visible to other
              users. We do not sell or share your personal information with
              third parties unless required by law.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              3. Data Security
            </h3>
            <p>
              We implement reasonable security measures to protect your data.
              However, no method of transmission over the Internet is 100%
              secure.
            </p>
          </div>
        </section>

        <div className="text-center text-sm text-gray-500">
          <p>Last updated: February 2026</p>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
