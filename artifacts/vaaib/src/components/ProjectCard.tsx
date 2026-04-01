import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface ProjectCardProps {
  mockupColor: string;
  mockupAccent: string;
  tag: string;
  title: string;
  description: string;
  testimonial: string;
  clientName: string;
  clientBusiness: string;
}

export default function ProjectCard({
  mockupColor,
  mockupAccent,
  tag,
  title,
  description,
  testimonial,
  clientName,
  clientBusiness,
}: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass-panel rounded-2xl overflow-hidden flex flex-col group hover:border-primary/30 hover:shadow-[0_0_30px_rgba(79,70,229,0.12)] transition-all duration-500"
    >
      {/* Placeholder screenshot */}
      <div
        className="relative h-48 overflow-hidden shrink-0"
        style={{ background: mockupColor }}
      >
        {/* Fake browser chrome */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
        <div className="absolute top-2.5 left-12 right-4 h-4 rounded bg-white/10 flex items-center px-2">
          <span className="text-[8px] text-white/40 truncate">{title.toLowerCase().replace(/\s/g, "")}.co.za</span>
        </div>
        {/* Abstract UI mock elements */}
        <div className="absolute inset-0 top-10 p-3 flex flex-col gap-2">
          <div className="h-8 rounded-lg w-3/4" style={{ background: mockupAccent }} />
          <div className="h-3 rounded w-full bg-white/10" />
          <div className="h-3 rounded w-5/6 bg-white/8" />
          <div className="flex gap-2 mt-1">
            <div className="h-7 rounded-md w-24" style={{ background: mockupAccent }} />
            <div className="h-7 rounded-md w-20 bg-white/10" />
          </div>
          <div className="mt-auto grid grid-cols-3 gap-2">
            <div className="h-14 rounded-lg bg-white/8" />
            <div className="h-14 rounded-lg bg-white/8" />
            <div className="h-14 rounded-lg bg-white/8" />
          </div>
        </div>
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <span
          className="self-start text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ background: `${mockupAccent}33`, color: mockupAccent.replace("0.", "").startsWith("rgba") ? "#a78bfa" : "#a78bfa" }}
        >
          {tag}
        </span>

        <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
          {description}
        </p>

        {/* Testimonial */}
        <div className="border-t border-white/5 pt-4">
          <Quote className="w-4 h-4 text-primary/50 mb-2" />
          <p className="text-sm text-foreground/70 italic leading-relaxed mb-3">
            "{testimonial}"
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {clientName.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground/90">{clientName}</p>
              <p className="text-xs text-muted-foreground">{clientBusiness}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
