import React, { useState } from "react";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";

interface ContactFormProps {
    onSubmitSuccess: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmitSuccess }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("Order Support");
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Clear fields
        setName("");
        setEmail("");
        setSubject("Order Support");
        setMessage("");
        
        onSubmitSuccess();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="contact-form-block md:col-span-7 bg-card-bg border border-border-main rounded-xl p-8 sm:p-10 flex flex-col gap-6"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                    id="name"
                    label="Full Name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <FormField
                    id="email"
                    label="Email Address"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <FormField
                id="subject"
                label="Subject"
                type="select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                options={[
                    "Order Support",
                    "Custom Design Inquiry",
                    "Fins Performance Tech",
                    "General Collaboration",
                ]}
            />

            <FormField
                id="message"
                label="Message"
                type="textarea"
                required
                placeholder="Describe your inquiry..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
            />

            <Button type="submit" variant="primary" fullWidth className="mt-4">
                Submit Inquiry
            </Button>
        </form>
    );
};

export default ContactForm;
