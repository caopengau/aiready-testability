import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ShieldAlert, TrendingUp } from 'lucide-react';

const data = [
  { month: 'Jan', without: 100, with: 100 },
  { month: 'Feb', without: 105, with: 98 },
  { month: 'Mar', without: 112, with: 85 },
  { month: 'Apr', without: 125, with: 78 },
  { month: 'May', without: 140, with: 72 },
  { month: 'Jun', without: 158, with: 65 },
];

export default function ComparisonChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="relative h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 blur-3xl" />
      <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 shadow-2xl h-full flex flex-col">
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
            Technical Debt Growth Over Time
          </h3>
          <p className="text-slate-600 text-center mb-6">
            AIReady helps you maintain code quality as your project scales
          </p>
          <div className="h-80">
            {typeof window !== 'undefined' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: 'Issues',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: '#64748b', fontSize: 12 },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="without"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Without AIReady"
                    dot={{ fill: '#ef4444', r: 5 }}
                    animationDuration={2000}
                  />
                  <Line
                    type="monotone"
                    dataKey="with"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="With AIReady"
                    dot={{ fill: '#10b981', r: 5 }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-8 text-sm pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3" />
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-sm" /> Without
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-bold flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm" /> With AIReady{' '}
              <TrendingUp className="w-3 h-3 text-green-500" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
