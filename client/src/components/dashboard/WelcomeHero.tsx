import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Play, Zap, CheckCircle2 } from "lucide-react";
import heroBg from "@assets/hero-bg.png";
import type { UserProfile, Stats } from "@/types/dashboard";

interface WelcomeHeroProps {
  userProfile: UserProfile;
  stats: Stats;
  planName: string;
  monthlyProgress: number;
  onStartSession: () => void;
}

export function WelcomeHero({
  userProfile,
  stats,
  planName,
  monthlyProgress,
  onStartSession
}: WelcomeHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground shadow-lg"
    >
      <div className="absolute inset-0 opacity-20">
        <img
          src={heroBg}
          alt="Background"
          className="w-full h-full object-cover mix-blend-overlay"
        />
      </div>

      <div className="relative p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <Link href="/profile">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden bg-white/10 cursor-pointer hover:border-white/60 transition-colors"
              >
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </Link>
            <div>
              <Link href="/profile" className="hover:underline decoration-white/50">
                <h2 className="text-3xl md:text-4xl font-display font-bold">
                  Olá, {userProfile.name.split(' ')[0]}! 👋
                </h2>
              </Link>
              <div className="text-sm text-primary-foreground/80 flex items-center gap-2">
                <span>Nível {userProfile.level}</span>
                <div className="w-24 h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(userProfile.xp / userProfile.nextLevelXp) * 100}%`
                    }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-yellow-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary-foreground/90 text-lg"
          >
            Você já completou <span className="font-bold">{monthlyProgress}%</span> da sua
            meta mensal. Continue focado no plano <strong>{planName}</strong>!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 pt-2"
          >
            <Button
              variant="secondary"
              className="gap-2 font-semibold transition-transform hover:scale-105"
              onClick={onStartSession}
            >
              <Play className="w-4 h-4 fill-current" />
              Continuar Estudando
            </Button>
            <Link href="/schedule">
              <Button variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10">
                Ver Cronograma
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="flex gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 min-w-[140px] text-center"
          >
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-yellow-400/20 rounded-full">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <div className="text-2xl font-bold">{stats.streak}</div>
            <div className="text-xs text-white/80 font-medium">Dias de ofensiva</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 min-w-[140px] text-center"
          >
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-emerald-400/20 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="text-2xl font-bold">{stats.questionsSolved}</div>
            <div className="text-xs text-white/80 font-medium">Questões</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
