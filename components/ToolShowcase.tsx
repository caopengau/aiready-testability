'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import {
  Brain,
  DollarSign,
  Compass,
  Search,
  Maximize2,
  FileCheck2,
} from 'lucide-react';

const tools = [
  {
    id: 'cognitive',
    icon: <Brain className="w-8 h-8" />,
    title: 'Cognitive Load',
    description:
      'Analyze the mental effort required for AI to understand your code beyond simple tokens.',
    package: '@aiready/core (future-proof)',
    color: 'from-blue-600 to-cyan-500',
    stats: [
      { metric: 'Model-Aware', value: 98 },
      { metric: 'Clarity', value: 85 },
      { metric: 'Depth', value: 92 },
    ],
  },
  {
    id: 'roi',
    icon: <DollarSign className="w-8 h-8" />,
    title: 'Business ROI & Debt',
    description:
      'Quantify the cost of confusing code in dollars and developers hours lost each month.',
    package: '@aiready/core (roi-engine)',
    color: 'from-green-600 to-teal-500',
    stats: [
      { metric: 'Precision', value: 92 },
      { metric: 'Temporal', value: 88 },
      { metric: 'Velocity', value: 95 },
    ],
  },
  {
    id: 'grounding',
    icon: <Compass className="w-8 h-8" />,
    title: 'Agent Grounding',
    description:
      'Measure how well autonomous agents can navigate and understand project structure unaided.',
    package: '@aiready/core (grounding)',
    color: 'from-purple-600 to-pink-500',
    stats: [
      { metric: 'Navigation', value: 96 },
      { metric: 'API Clarity', value: 91 },
      { metric: 'Structure', value: 94 },
    ],
  },
  {
    id: 'pattern',
    icon: <Search className="w-8 h-8" />,
    title: 'Pattern Detection',
    description:
      'Detect semantic duplicates and logic fragmentation that lead to AI hallucinations.',
    package: '@aiready/pattern-detect',
    color: 'from-orange-500 to-red-500',
    stats: [
      { metric: 'Recall', value: 94 },
      { metric: 'Symmetry', value: 89 },
      { metric: 'Coverage', value: 91 },
    ],
  },
  {
    id: 'context',
    icon: <Maximize2 className="w-8 h-8" />,
    title: 'Context Analysis',
    description:
      'Optimize token usage by mapping cross-file dependencies and context fragmentation.',
    package: '@aiready/context-analyzer',
    color: 'from-blue-500 to-indigo-500',
    stats: [
      { metric: 'Efficiency', value: 97 },
      { metric: 'Topology', value: 86 },
      { metric: 'Pruning', value: 93 },
    ],
  },
  {
    id: 'consistency',
    icon: <FileCheck2 className="w-8 h-8" />,
    title: 'Consistency Check',
    description:
      'Enforce naming conventions and structural patterns that clarify intent for AI models.',
    package: '@aiready/consistency',
    color: 'from-cyan-500 to-blue-600',
    stats: [
      { metric: 'Alignment', value: 95 },
      { metric: 'Uniformity', value: 92 },
      { metric: 'Strictness', value: 88 },
    ],
  },
];

export default function ToolShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
    >
      {tools.map((tool, idx) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: idx * 0.1, duration: 0.6 }}
          onHoverStart={() => setHoveredTool(tool.id)}
          onHoverEnd={() => setHoveredTool(null)}
          className="relative group"
        >
          {/* Animated background glow */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-20 blur-2xl rounded-3xl transition-opacity duration-500`}
            animate={hoveredTool === tool.id ? { scale: 1.1 } : { scale: 1 }}
          />

          <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
            {/* Icon with animation */}
            <motion.div
              animate={
                hoveredTool === tool.id ? { rotate: [0, -10, 10, -10, 0] } : {}
              }
              transition={{ duration: 0.5 }}
              className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg`}
            >
              {tool.icon}
            </motion.div>

            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {tool.title}
            </h3>
            <p className="text-slate-600 mb-4 flex-grow">{tool.description}</p>

            {/* Mini radar chart */}
            <div className="h-48 -mx-4 mb-4">
              {typeof window !== 'undefined' && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={tool.stats}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fill: '#64748b', fontSize: 10 }}
                    />
                    <Radar
                      name={tool.title}
                      dataKey="value"
                      stroke={`url(#gradient-${tool.id})`}
                      fill={`url(#gradient-${tool.id})`}
                      fillOpacity={0.6}
                    />
                    <defs>
                      <linearGradient
                        id={`gradient-${tool.id}`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={tool.color.split(' ')[1]}
                        />
                        <stop
                          offset="100%"
                          stopColor={tool.color.split(' ')[3]}
                        />
                      </linearGradient>
                    </defs>
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>

            <code className="text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200">
              {tool.package}
            </code>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
