
import React from 'react';

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <article className="prose lg:prose-lg mx-auto">
                    <h1>Terms of Service</h1>
                    <p className="lead">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    <h2>1. Agreement to Terms</h2>
                    <p>By using our website, Transplantify (the "Site"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Site. We may modify the Terms at any time, and such modifications shall be effective immediately upon posting.</p>

                    <h2>2. Use of the Service</h2>
                    <p>Transplantify provides a directory of hair transplant clinics and related informational content. This information is for general informational purposes only and does not constitute medical advice. You are responsible for your own research and decisions. You agree to use the Site for lawful purposes only.</p>

                    <h2>3. User Accounts</h2>
                    <p>To access certain features of the Site, you may be required to create an account. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>

                    <h2>4. User Content</h2>
                    <p>You are solely responsible for any content, including reviews, comments, and submissions, that you post on the Site ("User Content"). You grant Transplantify a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and display your User Content in connection with the Site. You agree not to post User Content that is unlawful, defamatory, obscene, or otherwise objectionable.</p>
                    
                    <h2>5. Intellectual Property</h2>
                    <p>The Site and its original content, features, and functionality are owned by Transplantify and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>

                    <h2>6. Disclaimers</h2>
                    <p>The Site is provided on an "AS IS" and "AS AVAILABLE" basis. Transplantify makes no warranties, express or implied, regarding the accuracy, reliability, or completeness of the information provided. We are not a medical provider and do not endorse any specific clinic, treatment, or product listed on the Site. Any reliance you place on such information is strictly at your own risk.</p>

                    <h2>7. Limitation of Liability</h2>
                    <p>In no event shall Transplantify, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Site.</p>
                    
                    <h2>8. Governing Law</h2>
                    <p>These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.</p>
                    
                    <h2>9. Contact Us</h2>
                    <p>If you have any questions about these Terms, please contact us at:</p>
                    <p>
                        Transplantify<br />
                        123 Innovation Drive<br />
                        Tech City, CA 94105, USA<br />
                        Email: <a href="mailto:legal@transplantify.com">legal@transplantify.com</a>
                    </p>
                </article>
            </div>
        </div>
    );
};

export default TermsOfServicePage;