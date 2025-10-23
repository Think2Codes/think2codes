import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle, Users } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 3 hours.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/923417965248?text=Hello! I need help with Think2codes', '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      description: "Get in touch via email",
      contact: "think2codes@gmail.com",
      action: "Send Email",
      link: "mailto:think2codes@gmail.com"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "WhatsApp Chat",
      description: "Quick support via WhatsApp",
      contact: "Chat with Saif & Shan",
      action: "Open WhatsApp",
      onClick: true
    }
  ];

  const faqs = [
    {
      question: "How does the AI analysis work?",
      answer: "Our AI system analyzes your code for syntax errors, logic issues, and suggests improvements in real-time."
    },
    {
      question: "Is Think2codes free to use?",
      answer: "Yes! We offer a free tier with basic features. Premium features are available with our subscription plans."
    },
    {
      question: "What programming languages are supported?",
      answer: "We currently support JavaScript, Python, Java, C++, HTML/CSS, React, TypeScript, and Go."
    },
    {
      question: "How do I unlock the AI Coding Agent?",
      answer: "The AI Coding Agent unlocks automatically when you reach Level 4 in our gaming system."
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gradient-hero">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="w-fit mx-auto">
            Contact Us
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold">
            Let's{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Connect
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about Think2codes? Need help getting started?
            Our team is here to support your coding journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What can we help you with?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your question or feedback..."
                    className="min-h-32"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & FAQs */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Other ways to reach us</h2>
              <div className="grid grid-cols-1 gap-4">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="shadow-card hover:shadow-glow transition-smooth cursor-pointer">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                          {info.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{info.title}</h3>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                          <p className="text-sm font-medium">{info.contact}</p>
                        </div>
                        {info.onClick ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={openWhatsApp}
                          >
                            {info.action}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={info.link}>{info.action}</a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <Card key={index} className="shadow-card">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          {faq.question}
                        </h3>
                        <p className="text-sm text-muted-foreground ml-7">
                          {faq.answer}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}