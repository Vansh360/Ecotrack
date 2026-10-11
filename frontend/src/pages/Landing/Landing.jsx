import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  Leaf,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  Trophy,
  Zap,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/lib/motion";

const features = [
  { icon: BarChart3, title: "See the pattern", desc: "Turn everyday choices into a living picture of your footprint across five key categories." },
  { icon: Brain, title: "Know what matters", desc: "Get practical, personalized guidance that follows your real activity data." },
  { icon: Target, title: "Move with intention", desc: "Set a monthly carbon budget and make progress visible, one choice at a time." },
  { icon: ShieldCheck, title: "Catch the outliers", desc: "Spot unusual spikes early so a single busy week does not become your new baseline." },
  { icon: TrendingDown, title: "Preview the change", desc: "Model a different routine before committing and see the potential reduction." },
  { icon: Trophy, title: "Keep it human", desc: "Celebrate momentum, earn badges, and grow alongside a thoughtful community." },
];

const steps = [
  ["01", "Make an account", "A calm, private home for your sustainability data."],
  ["02", "Log the ordinary", "Capture travel, energy, food, waste, and water in seconds."],
  ["03", "Find your leverage", "Use your patterns to focus on the changes with the most lift."],
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <section className="relative overflow-hidden px-6 pt-36 pb-20 md:px-10 md:pt-44 md:pb-28">
          <div className="grain absolute inset-0" />
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-70" />
          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.02fr_.98fr]">
            <div className="max-w-2xl">
              <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="mb-7 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-primary uppercase">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><Leaf size={15} /></span>
                A quieter way to live lighter
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible" className="font-display text-5xl leading-[.98] font-semibold tracking-tight md:text-7xl lg:text-[5.8rem]">
                Your impact, <span className="text-primary">made visible.</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible" className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                EcoTrack turns the invisible weight of everyday life into a clear, useful picture, then helps you change the parts that matter most.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="mt-9 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate("/register")}>Start your record <ArrowRight size={17} /></Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>Sign in</Button>
              </motion.div>
              <motion.div variants={stagger} initial="hidden" animate="visible" className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
                {["Free to use", "Private by design", "Built for real life"].map((item, index) => <motion.span key={item} variants={fadeUp} custom={index} className="flex items-center gap-2"><span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary"><Check size={12} /></span>{item}</motion.span>)}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 28, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: .8, delay: .2 }} className="relative mx-auto w-full max-w-[560px]">
              <div className="absolute -inset-5 rounded-[2rem] bg-primary/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-5 shadow-[0_30px_80px_-35px_oklch(0.22_0.035_155_/_0.55)] md:p-7">
                <div className="mb-7 flex items-center justify-between border-b border-border pb-5"><div><p className="text-[10px] font-bold tracking-[.18em] text-primary uppercase">This month</p><h2 className="mt-1 font-display text-2xl font-semibold">Your climate snapshot</h2></div><span className="flex size-10 items-center justify-center rounded-full bg-accent text-primary"><Sparkles size={18} /></span></div>
                <div className="grid grid-cols-[1fr_1.2fr] gap-5"><div className="rounded-xl bg-sidebar p-5 text-sidebar-foreground"><p className="text-xs text-sidebar-foreground/60">Sustainability score</p><p className="mt-4 font-display text-6xl text-sidebar-primary">82</p><p className="mt-2 text-xs text-sidebar-foreground/65">Up 14% from last month</p><div className="mt-8 h-2 rounded-full bg-sidebar-accent"><div className="h-full w-[82%] rounded-full bg-sidebar-primary" /></div></div><div className="flex flex-col justify-between rounded-xl border border-border p-5"><div><p className="text-xs text-muted-foreground">Total footprint</p><p className="mt-2 font-display text-4xl font-semibold">126.4 <span className="font-sans text-sm font-medium text-muted-foreground">kg CO₂e</span></p></div><div className="mt-7 flex items-end gap-2"><div className="h-14 flex-1 rounded-t bg-primary/20" /><div className="h-20 flex-1 rounded-t bg-primary/30" /><div className="h-11 flex-1 rounded-t bg-primary/45" /><div className="h-28 flex-1 rounded-t bg-primary" /><div className="h-16 flex-1 rounded-t bg-primary/55" /><div className="h-24 flex-1 rounded-t bg-primary/75" /></div></div></div>
                <div className="mt-5 flex items-center justify-between rounded-xl bg-accent/60 px-4 py-3 text-sm"><span className="flex items-center gap-2 text-accent-foreground"><Zap size={15} /> Biggest opportunity</span><strong className="text-primary">Transportation <ArrowRight className="ml-1 inline" size={14} /></strong></div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-border bg-card/45 px-6 py-24 md:px-10">
          <div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="mb-4 text-xs font-bold tracking-[.2em] text-primary uppercase">The complete picture</p><h2 className="font-display text-4xl leading-tight font-semibold md:text-5xl">Good decisions need <span className="text-primary">good context.</span></h2><p className="mt-5 max-w-xl text-muted-foreground">Everything you need to understand your baseline, find leverage, and build a lower-impact rhythm that actually fits your life.</p></div><div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, title, desc }, index) => <motion.div key={title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} className="bg-background p-7 transition-colors hover:bg-accent/40"><div className="mb-10 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon size={19} /></div><h3 className="font-display text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p></motion.div>)}</div></div>
        </section>

        <section className="px-6 py-24 md:px-10"><div className="mx-auto max-w-7xl"><div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="mb-4 text-xs font-bold tracking-[.2em] text-primary uppercase">A simple practice</p><h2 className="font-display text-4xl font-semibold md:text-5xl">Progress is a pattern, not a personality.</h2></div><p className="max-w-lg text-muted-foreground">There is no perfect footprint. EcoTrack gives you enough clarity to make your next choice with intention, without turning sustainability into another source of noise.</p></div><div className="mt-16 grid gap-10 border-t border-border pt-8 md:grid-cols-3">{steps.map(([number, title, desc]) => <div key={number}><span className="font-display text-4xl text-primary/55">{number}</span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p></div>)}</div></div></section>

        <section className="px-6 pb-24 md:px-10"><motion.div initial={{ opacity: 0, scale: .98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-sidebar px-7 py-14 text-sidebar-foreground md:px-14 md:py-20"><div className="grain absolute inset-0 opacity-10" /><div className="relative max-w-2xl"><p className="mb-4 text-xs font-bold tracking-[.2em] text-sidebar-primary uppercase">Begin with one week</p><h2 className="font-display text-4xl leading-tight md:text-6xl">Make the invisible actionable.</h2><p className="mt-5 max-w-lg text-sidebar-foreground/70">A better relationship with your footprint starts with seeing it clearly.</p><Button size="lg" className="mt-8 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" onClick={() => navigate("/register")}>Create your free account <ArrowRight size={17} /></Button></div></motion.div></section>
      </main>
      <Footer />
    </div>
  );
}
