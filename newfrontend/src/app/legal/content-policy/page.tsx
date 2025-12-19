'use client';

export default function ContentPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Content Policy</h1>
        <p className="text-muted-foreground mb-8">Last Updated: December 5, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to [PROJECT_NAME]'s Content Policy. This policy outlines the rules and guidelines 
            that govern user-generated content on our platform. Our goal is to foster a welcoming, 
            diverse, and engaging community where users can share ideas, have meaningful discussions, 
            and express themselves freely within reasonable boundaries.
          </p>
          <p className="mb-4">
            [PROJECT_NAME] is built on the principle that everyone deserves a voice, but not at the 
            expense of others' safety, well-being, or dignity. This Content Policy exists to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Protect our users from harmful and abusive content</li>
            <li>Maintain a respectful and constructive environment</li>
            <li>Ensure compliance with applicable laws and regulations</li>
            <li>Preserve the integrity and reputation of our platform</li>
            <li>Enable productive discussions across diverse topics</li>
          </ul>
          <p>
            By using [PROJECT_NAME], you agree to follow this Content Policy. Violations may result 
            in content removal, account restrictions, or permanent bans.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Allowed Content</h2>
          <p className="mb-4">
            We encourage users to share content that is:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Original and Creative:</strong> Your own thoughts, creations, stories, and perspectives</li>
            <li><strong>Informative:</strong> Educational content, news, tutorials, and helpful resources</li>
            <li><strong>Entertaining:</strong> Humor, memes, games, and engaging media (within guidelines)</li>
            <li><strong>Discussion-Oriented:</strong> Questions, debates, and conversations on various topics</li>
            <li><strong>Supportive:</strong> Helpful advice, encouragement, and community support</li>
            <li><strong>Attributed:</strong> Properly credited when sharing others' work (with permission)</li>
          </ul>
          <p className="mb-4">
            Good content typically:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Adds value to the community</li>
            <li>Respects the topic and purpose of the community it's posted in</li>
            <li>Encourages healthy discussion and engagement</li>
            <li>Is posted in the appropriate community or category</li>
            <li>Follows community-specific rules set by moderators</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Prohibited Content</h2>
          <p className="mb-4">
            The following types of content are strictly prohibited on [PROJECT_NAME]:
          </p>

          <h3 className="text-xl font-medium mb-3">Hate Speech and Discrimination</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Content promoting hatred against individuals or groups based on race, ethnicity, nationality, religion, gender, sexual orientation, disability, or other protected characteristics</li>
            <li>Slurs, derogatory language, or dehumanizing content targeting any group</li>
            <li>Content promoting or glorifying supremacist ideologies</li>
            <li>Denial or trivialization of documented atrocities or genocides</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Violence and Threats</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Threats of violence against individuals, groups, or institutions</li>
            <li>Content glorifying, encouraging, or inciting violence</li>
            <li>Graphic violence or gore intended to shock or disturb</li>
            <li>Instructions for carrying out violent acts</li>
            <li>Content celebrating or trivializing mass casualty events</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Harassment and Bullying</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Targeted harassment, intimidation, or abuse of individuals</li>
            <li>Doxxing (sharing private information without consent)</li>
            <li>Brigading or coordinated attacks on users or communities</li>
            <li>Cyberstalking or persistent unwanted contact</li>
            <li>Sexual harassment or unwanted sexual attention</li>
            <li>Encouraging others to harass or target individuals</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Illegal Activity</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Content promoting or facilitating illegal activities</li>
            <li>Sale or distribution of illegal drugs, weapons, or controlled substances</li>
            <li>Content related to human trafficking or exploitation</li>
            <li>Fraud, scams, or financial crimes</li>
            <li>Copyright infringement or intellectual property theft</li>
            <li>Content violating local, national, or international laws</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Sexual and Exploitative Content</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Child sexual abuse material (CSAM) — zero tolerance, reported to authorities</li>
            <li>Non-consensual intimate imagery ("revenge porn")</li>
            <li>Sexual content involving minors in any form</li>
            <li>Sexual exploitation or trafficking content</li>
            <li>Unsolicited sexual content or solicitation</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Spam and Manipulation</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Spam, including repetitive posts, excessive self-promotion, or unsolicited advertising</li>
            <li>Vote manipulation, fake engagement, or artificial boosting</li>
            <li>Misleading or deceptive content designed to manipulate users</li>
            <li>Phishing, malware distribution, or security threats</li>
            <li>Impersonation of individuals, brands, or organizations</li>
            <li>Coordinated inauthentic behavior or bot networks</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Misinformation</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Deliberately false information that could cause real-world harm</li>
            <li>Health misinformation that contradicts established medical consensus</li>
            <li>Election misinformation designed to interfere with democratic processes</li>
            <li>Manipulated media (deepfakes) presented as authentic</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. User Behavior Standards</h2>
          <p className="mb-4">
            Beyond content, we expect all users to maintain certain standards of behavior:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Be Respectful:</strong> Treat others as you would like to be treated, even in disagreement</li>
            <li><strong>Argue in Good Faith:</strong> Engage constructively; avoid trolling or bad-faith arguments</li>
            <li><strong>Stay On Topic:</strong> Keep discussions relevant to the community and conversation</li>
            <li><strong>Accept Moderation:</strong> Respect moderator decisions and community rules</li>
            <li><strong>Report, Don't Retaliate:</strong> Use reporting tools instead of engaging with rule-breakers</li>
            <li><strong>Protect Privacy:</strong> Don't share others' personal information without consent</li>
            <li><strong>Be Authentic:</strong> Don't mislead others about who you are</li>
          </ul>
          <p>
            Remember that behind every username is a real person. Constructive criticism is welcome; 
            personal attacks are not.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Moderation Rules</h2>
          <p className="mb-4">
            [PROJECT_NAME] uses a combination of community moderation and platform-level enforcement:
          </p>

          <h3 className="text-xl font-medium mb-3">Community Moderators</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Each community has volunteer moderators who enforce community-specific rules</li>
            <li>Moderators can remove content, issue warnings, and ban users from their communities</li>
            <li>Moderators must follow our Moderator Guidelines and cannot abuse their position</li>
            <li>Moderator actions can be appealed through proper channels</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Platform Administrators</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Administrators handle site-wide policy violations and serious offenses</li>
            <li>They can issue platform-wide bans and take action against problematic communities</li>
            <li>Administrators investigate reports that community moderators cannot address</li>
            <li>They ensure moderators follow guidelines and don't abuse their privileges</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Automated Systems</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>We use automated tools to detect and remove certain prohibited content</li>
            <li>Spam filters help reduce unwanted content across the platform</li>
            <li>Automated decisions can be appealed for human review</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Reporting Violations</h2>
          <p className="mb-4">
            If you encounter content or behavior that violates this policy, please report it:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Report Button:</strong> Use the report option on any post, comment, or message</li>
            <li><strong>Contact Moderators:</strong> Message community moderators for community-specific issues</li>
            <li><strong>Email:</strong> Contact [CONTACT_EMAIL] for serious or urgent matters</li>
            <li><strong>Emergency:</strong> Contact local law enforcement for immediate safety threats</li>
          </ul>
          <p className="mb-4">
            When reporting, please:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Select the most accurate reason for your report</li>
            <li>Provide context or additional information when helpful</li>
            <li>Include links or screenshots if the content might be removed before review</li>
            <li>Be patient — reports are reviewed in order of severity and timing</li>
          </ul>
          <p>
            False reports or abuse of the reporting system may result in action against your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Enforcement Actions</h2>
          <p className="mb-4">
            When violations are confirmed, we may take the following actions depending on severity:
          </p>

          <h3 className="text-xl font-medium mb-3">Content-Level Actions</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Content Removal:</strong> Violating content is removed from the platform</li>
            <li><strong>Content Labeling:</strong> Some content may be labeled as sensitive or misleading</li>
            <li><strong>Visibility Reduction:</strong> Content may be removed from recommendations</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Account-Level Actions</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Warning:</strong> Official notice about the violation and expected behavior</li>
            <li><strong>Temporary Restrictions:</strong> Limited posting, commenting, or voting abilities</li>
            <li><strong>Temporary Suspension:</strong> Account suspended for a defined period (days to weeks)</li>
            <li><strong>Permanent Ban:</strong> Account permanently removed from the platform</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Community-Level Actions</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Quarantine:</strong> Community restricted with warning labels</li>
            <li><strong>Restricted Mode:</strong> Limited features and increased oversight</li>
            <li><strong>Community Ban:</strong> Entire community removed for systematic violations</li>
          </ul>

          <p>
            Severe violations (CSAM, credible violence threats, etc.) result in immediate permanent 
            bans and may be reported to law enforcement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Appeals Process</h2>
          <p className="mb-4">
            If you believe an enforcement action was made in error, you can appeal:
          </p>

          <h3 className="text-xl font-medium mb-3">How to Appeal</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Submit an appeal through the notification you received about the action</li>
            <li>Or email [CONTACT_EMAIL] with "Appeal" in the subject line</li>
            <li>Include your username, the action taken, and why you believe it was incorrect</li>
            <li>Provide any evidence or context that supports your appeal</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Appeal Guidelines</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Appeals must be submitted within 30 days of the action</li>
            <li>Each action can only be appealed once</li>
            <li>Appeals are reviewed by a different team member than the original decision</li>
            <li>You will receive a response within 14 business days</li>
            <li>Appeal decisions are final</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">What's Not Appealable</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Actions for CSAM or child exploitation (zero tolerance)</li>
            <li>Bans for credible violence or terrorism threats</li>
            <li>Repeated violations after previous warnings</li>
            <li>Evasion of previous bans</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
          <p className="mb-4">
            For questions about this Content Policy or to report serious violations:
          </p>
          <ul className="list-none space-y-2">
            <li><strong>General Inquiries:</strong> [CONTACT_EMAIL]</li>
            <li><strong>Report Abuse:</strong> [ABUSE_EMAIL] or use in-app reporting</li>
            <li><strong>Appeals:</strong> [APPEALS_EMAIL]</li>
            <li><strong>Company:</strong> [COMPANY_NAME]</li>
            <li><strong>Address:</strong> [COMPANY_ADDRESS]</li>
          </ul>
          <p className="mt-4 mb-4">
            For emergencies involving immediate threats to safety, please contact local law 
            enforcement directly.
          </p>
          <p>
            We review and update this Content Policy regularly to address new challenges and 
            community feedback. Major changes will be announced with advance notice.
          </p>
        </section>

        <hr className="my-8" />
        <p className="text-sm text-muted-foreground">
          By using [PROJECT_NAME], you agree to abide by this Content Policy. Together, we can 
          build a community that is engaging, respectful, and welcoming to all.
        </p>
      </article>
    </div>
  );
}
