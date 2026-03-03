import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ArrowDown, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Without AIReady', tokens: 100, color: '#ef4444' },
  { name: 'With AIReady', tokens: 60, color: '#10b981' },
];

export default function InteractiveChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
      <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 shadow-2xl h-full flex flex-col">
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
            Context Token Optimization
          </h3>
          <p className="text-slate-600 text-center mb-6">
            Save up to 40% on API costs by eliminating redundant context
          </p>
          <div className="h-80">
            {typeof window !== 'undefined' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: 'Tokens (k)',
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
                  <Bar
                    dataKey="tokens"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1500}
                    barSize={60}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-8 text-sm pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm" />
            <span className="text-slate-600 font-medium flex items-center gap-1">
              Before
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-sm" />
            <span className="text-slate-900 font-bold flex items-center gap-1">
              After AIReady <TrendingUp className="w-3 h-3 text-green-500" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
