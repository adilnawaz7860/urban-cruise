"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/data/faqs";
import { useTranslation } from "@/hooks/use-translation";
import { pick } from "@/lib/utils";

export function FaqSection() {
  const { t, locale } = useTranslation();

  return (
    <section className="relative mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          {t.faq.title}
        </span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t.faq.subtitle}</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-10"
      >
        <Accordion className="glass-card divide-y divide-border/60 rounded-2xl px-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-0 px-4">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                {pick(locale, faq.question, faq.questionHi)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {pick(locale, faq.answer, faq.answerHi)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
