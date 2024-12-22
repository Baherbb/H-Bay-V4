import React, { useState } from "react";
import emailjs from "emailjs-com";

const SupportForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    agreed: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, agreed: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreed) {
      alert("You must agree to the Privacy Policy.");
      return;
    }

    emailjs
      .send(
        "service_fgj7fsi", // Replace with your EmailJS Service ID
        "template_qzhkcct", // Replace with your EmailJS Template ID
        {
            fullName: formData.fullName,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            recipientEmail: "s-baher.abdelmegeid@zewailcity.edu.eg",
        },
        "pvj0QJ4n5xoccF-hM" // Replace with your EmailJS User ID
      )
      .then(
        () => {
          alert("Message sent successfully!");
          setFormData({
            fullName: "",
            email: "",
            subject: "",
            message: "",
            agreed: false,
          });
        },
        (error) => {
          console.error("Error sending email:", error);
          alert("Failed to send the message.");
        }
      );
  };

  return (
    <div className="flex-1 bg-white -mt-20">
      <div className="bg-orange-500 text-white p-3">
        <h1 className="text-3xl font-bold">Send Us a Message</h1>
        <p className="text-sm">We are here to help you.</p>
      </div>

      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            ></textarea>
          </div>
          <div>
            <input
              type="checkbox"
              checked={formData.agreed}
              onChange={handleCheckboxChange}
              required
            />
            <label className="ml-2">
              I agree to the <a href="/privacy-policy">Privacy Policy</a>.
            </label>
          </div>
          <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportForm;
