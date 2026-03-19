import React, { useState } from "react";
import ChatBot from "@/components/ChatBot";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Brain, 
  Activity, 
  MessageSquare, 
  Mic, 
  CheckCircle2, 
  Search,
  Clock,
  TrendingUp,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

const packageOptions = [
  { value: "starter", label: "Starter Site — $247" },
  { value: "pro",     label: "Pro Presence — $597" },
  { value: "authority", label: "AI Authority — $1,197" },
  { value: "general",  label: "Not sure yet" },
];

const contactSchema = z.object({
  name:            z.string().min(2, "Name is required"),
  email:           z.string().email("Invalid email address"),
  businessName:    z.string().min(2, "Business name is required"),
  message:         z.string().min(10, "Please tell us a bit about your needs"),
  packageInterest: z.enum(["starter", "pro", "authority", "general"]),
});

type ContactFormData = z.infer<typeof contactSchema>;

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<"starter" | "pro" | "authority" | "general">("general");

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { packageInterest: "general" }
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      toast({
        title: "Request Received!",
        description: "We'll be in touch within 24 hours to discuss your AI visibility strategy.",
      });
      reset();
      setSelectedPackage("general");
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const selectPackageAndScrollToContact = (pkg: "starter" | "pro" | "authority") => {
    setSelectedPackage(pkg);
    setValue("packageInterest", pkg);
    scrollTo("contact");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full mix-blend-screen opacity-30" />
        <div className="absolute inset-0 bg-[url('/images/hero-glow.png')] bg-cover bg-center opacity-30 mix-blend-screen" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-white/5 border-t-0 border-x-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-display font-bold text-2xl tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            VAAIB
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <button onClick={() => scrollTo("problem")} className="hover:text-foreground transition-colors">The Shift</button>
            <button onClick={() => scrollTo("solution")} className="hover:text-foreground transition-colors">Platform</button>
            <button onClick={() => scrollTo("pricing")} className="hover:text-foreground transition-colors">Pricing</button>
          </div>
          <Button onClick={() => scrollTo("contact")} className="rounded-full px-6">
            Get Started
          </Button>
        </div>
      </nav>

      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-20 pb-32">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-primary mb-4 border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                The Future of Search is Here
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold tracking-tight leading-[1.1]">
                Traditional SEO Is <span className="text-muted-foreground line-through decoration-primary/50 decoration-[4px]">Dead</span>.<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-foreground to-primary text-glow">
                  AI Changes Everything.
                </span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Small businesses can no longer afford to wait for search engines. AI-driven discovery is happening right now — and VAAIB keeps you ahead of the curve.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Button size="lg" className="w-full sm:w-auto rounded-full text-base group" onClick={() => scrollTo("pricing")}>
                  Get AI Visibility Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full text-base" onClick={() => scrollTo("problem")}>
                  See How It Works
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Problem Section */}
        <section id="problem" className="py-24 px-4 bg-black/40 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { icon: Search,    stat: "67%",    text: "of consumers now use AI chat tools for product and service discovery instead of traditional search." },
                { icon: Clock,     stat: "6+ Months", text: "is how long traditional SEO takes to show results. AI indexing happens in days or hours." },
                { icon: TrendingUp, stat: "90%",   text: "of search decisions will be driven by AI-powered answers within the next 24 months." }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-panel p-8 rounded-2xl hover:border-primary/30 transition-colors duration-500 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-4xl font-display font-bold mb-4">{item.stat}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="py-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-4xl md:text-5xl font-display font-bold mb-6">
                Built for the AI Era
              </motion.h2>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We don't just build websites. We engineer highly-optimized digital presences designed specifically to be read, understood, and recommended by AI models like ChatGPT, Claude, and Gemini.
              </motion.p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Globe,         title: "AI-Indexed Content Strategy",    desc: "We structure your site's data precisely how Large Language Models prefer to ingest it, ensuring you are recommended when users ask AI for your services." },
                { icon: Activity,      title: "Real-Time Visibility Monitoring", desc: "Track how often your business is cited in AI responses across different platforms with our proprietary monitoring dashboard." },
                { icon: MessageSquare, title: "Chatbot Integration Ready",       desc: "Turn your website into an interactive agent. Deploy custom-trained AI assistants that know your business inside and out." },
                { icon: Mic,           title: "Optimized for Voice & AI Search", desc: "Move beyond keywords. We optimize for the conversational, natural language queries people use when talking to AI." }
              ].map((feature, i) => (
                <motion.div key={i} variants={fadeUp} className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:bg-white/[0.05] transition-all flex gap-6">
                  <div className="shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
                    <feature.icon className="w-7 h-7 text-primary relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-4 bg-black/40 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-4xl md:text-5xl font-display font-bold mb-6">
                Simple, Transparent Pricing
              </motion.h2>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Invest in your AI visibility once. No hidden monthly retainers.
              </motion.p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
              {/* Tier 1 */}
              <motion.div variants={fadeUp} className="glass-panel p-8 rounded-3xl h-fit">
                <div className="mb-8">
                  <h3 className="text-2xl font-display font-semibold mb-2">Starter Site</h3>
                  <p className="text-muted-foreground">Perfect for new businesses needing instant AI presence.</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-display font-bold">$247</span>
                  <span className="text-muted-foreground"> / one-time</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["1-page responsive website", "AI-optimized content structure", "Basic SEO metadata", "Contact form integration", "30-day post-launch support"].map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full rounded-xl h-12" onClick={() => selectPackageAndScrollToContact("starter")}>
                  Select Starter
                </Button>
              </motion.div>

              {/* Tier 2 - Highlighted */}
              <motion.div variants={fadeUp} className="relative p-8 rounded-3xl bg-gradient-to-b from-card to-background border-2 border-primary shadow-[0_0_40px_rgba(79,70,229,0.15)] md:-my-4 z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                  Most Popular
                </div>
                <div className="mb-8">
                  <h3 className="text-2xl font-display font-semibold mb-2">Pro Presence</h3>
                  <p className="text-muted-foreground">Complete digital footprint optimized for AI engines.</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-display font-bold">$597</span>
                  <span className="text-muted-foreground"> / one-time</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Up to 5 pages", "Advanced AI content optimization", "Full traditional SEO suite", "Blog/news CMS section", "Analytics integration setup", "90-day post-launch support"].map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground/90 font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-xl h-12 text-base" onClick={() => selectPackageAndScrollToContact("pro")}>
                  Select Pro
                </Button>
              </motion.div>

              {/* Tier 3 */}
              <motion.div variants={fadeUp} className="glass-panel p-8 rounded-3xl h-fit">
                <div className="mb-8">
                  <h3 className="text-2xl font-display font-semibold mb-2">AI Authority</h3>
                  <p className="text-muted-foreground">The ultimate package with integrated conversational AI.</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-display font-bold">$1,197</span>
                  <span className="text-muted-foreground"> / one-time</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Unlimited pages", "Custom AI Chatbot integration", "Automated AI content pipeline", "Voice search optimization", "Priority indexing strategy", "Custom AI personas", "6-month support & reviews"].map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full rounded-xl h-12" onClick={() => selectPackageAndScrollToContact("authority")}>
                  Select Authority
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-4 relative">
          <div className="max-w-3xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold mb-4">Ready to Stay Ahead?</h2>
              <p className="text-xl text-muted-foreground">
                Drop your details below and we'll reach out to discuss your AI visibility strategy.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-panel p-8 sm:p-12 rounded-3xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Full Name</label>
                    <Input
                      {...register("name")}
                      className="bg-black/50 border-white/10 focus-visible:ring-primary h-12 rounded-xl"
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Email Address</label>
                    <Input
                      {...register("email")}
                      type="email"
                      className="bg-black/50 border-white/10 focus-visible:ring-primary h-12 rounded-xl"
                      placeholder="john@company.com"
                    />
                    {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Business Name</label>
                  <Input
                    {...register("businessName")}
                    className="bg-black/50 border-white/10 focus-visible:ring-primary h-12 rounded-xl"
                    placeholder="Acme Corp"
                  />
                  {errors.businessName && <p className="text-destructive text-sm">{errors.businessName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Package Interest</label>
                  <select
                    {...register("packageInterest")}
                    value={selectedPackage}
                    onChange={(e) => {
                      const val = e.target.value as typeof selectedPackage;
                      setSelectedPackage(val);
                      setValue("packageInterest", val);
                    }}
                    className="w-full h-12 rounded-xl px-4 bg-black/50 border border-white/10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {packageOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#0a0a0a]">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.packageInterest && <p className="text-destructive text-sm">{errors.packageInterest.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">How can we help?</label>
                  <Textarea
                    {...register("message")}
                    className="bg-black/50 border-white/10 focus-visible:ring-primary min-h-[150px] rounded-xl resize-y"
                    placeholder="Tell us about your current online presence and goals..."
                  />
                  {errors.message && <p className="text-destructive text-sm">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 rounded-xl text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Request..." : "Request Consultation"}
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <ChatBot />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="font-display font-bold text-2xl tracking-tighter flex items-center gap-2 text-white">
              <Brain className="w-5 h-5 text-primary" />
              VAAIB
            </div>
            <p className="text-muted-foreground text-sm">Powering Small Business in the AI Era</p>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <button onClick={() => scrollTo("problem")} className="hover:text-white transition-colors">The Shift</button>
            <button onClick={() => scrollTo("solution")} className="hover:text-white transition-colors">Platform</button>
            <button onClick={() => scrollTo("pricing")} className="hover:text-white transition-colors">Pricing</button>
            <button onClick={() => scrollTo("contact")} className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()} VAAIB. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
