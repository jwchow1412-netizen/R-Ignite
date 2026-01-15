"use client";

import { motion } from "framer-motion";

type TimelineItem = {
  date: string;
  title: string;
  description?: string;
};

type TimelineProps = {
  items: TimelineItem[];
};

export default function Timeline({ items }: TimelineProps) {
  return (
    <ol className="relative space-y-6 before:absolute before:left-4 before:top-0 before:h-full before:w-px before:bg-[rgba(255,255,255,0.12)] md:before:left-5">
      {items.map((item, index) => (
        <motion.li
          key={item.title + item.date}
          className="relative pl-12 md:pl-14"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,100,118,0.4)] bg-[rgba(212,100,118,0.16)] text-xs font-bold text-white md:left-1">
            {index + 1}
          </span>
          <div className="glass-panel p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(248,244,246,0.65)]">
              {item.date}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
            {item.description ? (
              <p className="mt-2 text-sm text-[rgba(248,244,246,0.8)]">{item.description}</p>
            ) : null}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
