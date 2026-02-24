import { ThemeColors, SeverityLevel, EdgeType, BusinessMetrics } from '../types';
import { severityColors, edgeColors } from '../constants';

// Checkbox/Toggle Icon
const CheckIcon = ({ checked }: { checked: boolean }) => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={checked ? '#10b981' : '#6b7280'} 
    strokeWidth="3"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {checked && <path d="M20 6L9 17l-5-5" />}
  </svg>
);

// Legend Item with Toggle
function LegendItemWithToggle({ 
  color, 
  label, 
  isGlow = false,
  isLine = false,
  colors,
  isVisible,
  onToggle
}: { 
  color: string; 
  label: string;
  isGlow?: boolean;
  isLine?: boolean;
  colors: ThemeColors;
  isVisible: boolean;
  onToggle: () => void;
}) {
  return (
    <button 
      onClick={onToggle}
      className="group cursor-pointer transition-all hover:bg-white/5 w-full"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        padding: '6px 8px',
        borderRadius: '8px',
        opacity: isVisible ? 1 : 0.4,
      }}
      title={isVisible ? `Click to hide ${label}` : `Click to show ${label}`}
    >
      {/* Toggle checkbox */}
      <div 
        className="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
        style={{ 
          borderColor: isVisible ? '#10b981' : colors.panelBorder,
          backgroundColor: isVisible ? `${color}20` : 'transparent'
        }}
      >
        {isVisible && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      
      {isLine ? (
        <span 
          className="w-10 h-1 rounded-full flex-shrink-0" 
          style={{ backgroundColor: color }} 
        />
      ) : (
        <span 
          className={`w-4 h-4 rounded-full flex-shrink-0 ${isGlow ? 'shadow-lg' : ''}`}
          style={{ 
            backgroundColor: color, 
            boxShadow: isGlow && isVisible ? `0 0 10px ${color}90` : 'none' 
          }} 
        />
      )}
      <span 
        className="text-sm font-medium transition-colors leading-tight"
        style={{ color: colors.textMuted }}
      >
        {label}
      </span>
    </button>
  );
}

// Regular Legend Item (non-toggleable)
function LegendItem({ 
  color, 
  label, 
  isGlow = false,
  isLine = false,
  colors
}: { 
  color: string; 
  label: string;
  isGlow?: boolean;
  isLine?: boolean;
  colors: ThemeColors;
}) {
  return (
    <div 
      className="group cursor-default transition-all hover:bg-white/5"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        padding: '6px 0',
        borderRadius: '8px'
      }}
    >
      {isLine ? (
        <span 
          className="w-10 h-1 rounded-full transition-transform group-hover:scale-y-150 flex-shrink-0" 
          style={{ backgroundColor: color }} 
        />
      ) : (
        <span 
          className={`w-4 h-4 rounded-full transition-transform group-hover:scale-125 flex-shrink-0 ${isGlow ? 'shadow-lg' : ''}`}
          style={{ 
            backgroundColor: color, 
            boxShadow: isGlow ? `0 0 10px ${color}90` : 'none' 
          }} 
        />
      )}
      <span 
        className="text-sm font-medium transition-colors leading-tight"
        style={{ color: colors.textMuted }}
      >
        {label}
      </span>
    </div>
  );
}

interface LegendPanelProps {
  colors: ThemeColors;
  visibleSeverities: Set<SeverityLevel>;
  visibleEdgeTypes: Set<EdgeType>;
  onToggleSeverity: (severity: SeverityLevel) => void;
  onToggleEdgeType: (edgeType: EdgeType) => void;
  metadata?: BusinessMetrics;
}

export function LegendPanel({ 
  colors, 
  visibleSeverities, 
  visibleEdgeTypes,
  onToggleSeverity,
  onToggleEdgeType,
  metadata,
}: LegendPanelProps) {
  // Get visible counts - exclude 'default' (No Issues) from count
  const visibleSeverityCount = visibleSeverities.size;
  const totalSeverities = Object.keys(severityColors).length - 1; // -1 for 'default'
  const visibleEdgeCount = visibleEdgeTypes.size;
  const totalEdgeTypes = Object.keys(edgeColors).filter(k => k !== 'default' && k !== 'reference').length;

  return (
    <div style={{ padding: '16px 16px', animation: 'fadeIn 0.2s ease-in' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header */}
        <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${colors.cardBorder}` }}>
          <h2 
            className="text-base font-bold tracking-wide" 
            style={{ color: colors.text }}
          >
            Legend
          </h2>
        </div>

        {/* Severity Legend with Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h3 
              className="text-xs font-bold uppercase tracking-widest" 
              style={{ color: colors.textMuted }}
            >
              Severity
            </h3>
            <span 
              className="text-xs font-medium" 
              style={{ color: visibleSeverityCount === totalSeverities ? '#10b981' : '#f59e0b' }}
            >
              {visibleSeverityCount}/{totalSeverities}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Object.entries(severityColors)
              .filter(([key]) => key !== 'default') // Filter out "No Issues" - not useful for visualization
              .map(([key, color]) => (
                <LegendItemWithToggle 
                  key={key}
                  color={color}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  isGlow={key !== 'default'}
                  colors={colors}
                  isVisible={visibleSeverities.has(key as SeverityLevel)}
                  onToggle={() => onToggleSeverity(key as SeverityLevel)}
                />
              ))}
          </div>
        </div>

        {/* Connections Legend with Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h3 
              className="text-xs font-bold uppercase tracking-widest" 
              style={{ color: colors.textMuted }}
            >
              Connections
            </h3>
            <span 
              className="text-xs font-medium" 
              style={{ color: visibleEdgeCount === totalEdgeTypes ? '#10b981' : '#f59e0b' }}
            >
              {visibleEdgeCount}/{totalEdgeTypes}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Object.entries(edgeColors)
              .filter(([k]) => k !== 'default' && k !== 'reference')
              .map(([key, color]) => (
                <LegendItemWithToggle 
                  key={key}
                  color={color}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  isLine
                  colors={colors}
                  isVisible={visibleEdgeTypes.has(key as EdgeType)}
                  onToggle={() => onToggleEdgeType(key as EdgeType)}
                />
              ))}
          </div>
        </div>

        {/* Node Size Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 
            className="text-xs font-bold uppercase tracking-widest" 
            style={{ color: colors.textMuted, marginBottom: '4px' }}
          >
            Node Size
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p 
              className="text-xs leading-relaxed" 
              style={{ color: colors.textMuted }}
            >
              Larger nodes indicate higher <span className="text-cyan-400 font-medium">token cost</span> and more <span className="text-purple-400 font-medium">issues</span>.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 border-2" style={{ borderColor: colors.panel }} />
                <span className="w-5 h-5 rounded-full bg-cyan-400 border-2" style={{ borderColor: colors.panel }} />
                <span className="w-7 h-7 rounded-full bg-cyan-400 border-2" style={{ borderColor: colors.panel }} />
              </div>
              <span className="text-xs" style={{ color: colors.textMuted }}>→</span>
              <span className="text-xs font-medium" style={{ color: colors.text }}>More Impact</span>
            </div>
          </div>
        </div>

        {/* Business Impact Section */}
        {metadata && (metadata.estimatedMonthlyCost || metadata.estimatedDeveloperHours || metadata.aiAcceptanceRate) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 
              className="text-xs font-bold uppercase tracking-widest" 
              style={{ color: colors.textMuted, marginBottom: '4px' }}
            >
              Business Impact
            </h3>
            <div 
              className="p-3 rounded-xl" 
              style={{ backgroundColor: `${colors.cardBg}80`, display: 'flex', flexDirection: 'column', gap: '6px' }}
            >
              {metadata.estimatedMonthlyCost !== undefined && (
                <div className="flex justify-between items-center py-1 px-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-xs font-medium" style={{ color: colors.textMuted }}>💰 Monthly Cost</span>
                  <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>
                    {metadata.estimatedMonthlyCost >= 1000
                      ? `$${(metadata.estimatedMonthlyCost / 1000).toFixed(1)}k`
                      : `$${metadata.estimatedMonthlyCost.toFixed(0)}`}
                  </span>
                </div>
              )}
              {metadata.estimatedDeveloperHours !== undefined && (
                <div className="flex justify-between items-center py-1 px-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-xs font-medium" style={{ color: colors.textMuted }}>⏱️ Fix Time</span>
                  <span className="text-xs font-bold" style={{ color: '#22d3ee' }}>
                    {metadata.estimatedDeveloperHours >= 40
                      ? `${(metadata.estimatedDeveloperHours / 40).toFixed(1)}w`
                      : `${metadata.estimatedDeveloperHours.toFixed(1)}h`}
                  </span>
                </div>
              )}
              {metadata.aiAcceptanceRate !== undefined && (
                <div className="flex justify-between items-center py-1 px-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-xs font-medium" style={{ color: colors.textMuted }}>🤖 AI Acceptance</span>
                  <span 
                    className="text-xs font-bold"
                    style={{ 
                      color: metadata.aiAcceptanceRate >= 0.7 ? '#4ade80' : metadata.aiAcceptanceRate >= 0.5 ? '#fb923c' : '#f87171' 
                    }}
                  >
                    {Math.round(metadata.aiAcceptanceRate * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div 
          className="p-4 rounded-xl"
          style={{ 
            backgroundColor: `${colors.cardBg}80`
          }}
        >
          <p 
            className="text-xs leading-relaxed" 
            style={{ color: colors.textMuted }}
          >
            <span className="font-semibold text-amber-400">💡 Tip:</span> Click and drag nodes to rearrange. Scroll to zoom. Toggle items above to filter.
          </p>
        </div>
      </div>
    </div>
  );
}
