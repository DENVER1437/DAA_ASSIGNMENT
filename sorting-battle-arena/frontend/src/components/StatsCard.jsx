import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

export const StatsCard = ({
  title,
  value,
  decimals = 0,
  unit = '',
  icon: Icon,
  trend,
  color = 'blue',
  subtitle
}) => {
  const colorMap = {
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.3)]',
      gradient: 'from-blue-500/10 to-transparent'
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.3)]',
      gradient: 'from-purple-500/10 to-transparent'
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]',
      gradient: 'from-emerald-500/10 to-transparent'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.3)]',
      gradient: 'from-amber-500/10 to-transparent'
    },
    coral: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.3)]',
      gradient: 'from-rose-500/10 to-transparent'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`group relative p-5 rounded-3xl bg-zinc-900/70 backdrop-blur-xl border ${scheme.border} ${scheme.glow} transition-all duration-300 overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${scheme.gradient} opacity-40 pointer-events-none`} />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {typeof value === 'number' ? (
                <CountUp end={value} decimals={decimals} duration={1.2} separator="," />
              ) : (
                value || '0'
              )}
            </span>
            {unit && <span className="text-sm font-semibold text-zinc-400">{unit}</span>}
          </div>
          {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="relative z-10 mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-zinc-400">
          <span>{trend}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
