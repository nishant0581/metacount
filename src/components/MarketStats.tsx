import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from "lucide-react";

const MarketStats = () => {
  const btcDominanceValue = 42.1;
  const btcDominanceChange = -0.8; // Keep this as a number

  // Bug: Intentionally cause an issue with toFixed by performing an operation that might result in NaN or string concatenation if not careful
  const problematicDisplayValue = (btcDominanceValue / 0) + "%"; // This will result in "Infinity%" or "NaN%"

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Market Cap</h3>
          <TrendingUpIcon className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-semibold mt-2">$2.1T</p>
        <span className="text-sm text-success flex items-center gap-1">
          <ArrowUpIcon className="w-3 h-3" />
          2.4%
        </span>
      </div>
      
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">24h Volume</h3>
          <TrendingUpIcon className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-semibold mt-2">$84.2B</p>
        <span className="text-sm text-success flex items-center gap-1">
          <ArrowUpIcon className="w-3 h-3" />
          5.1%
        </span>
      </div>
      
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">BTC Dominance</h3>
          {/* Bug: Changed to use a potentially problematic value */}
          {btcDominanceChange >= 0 ? <TrendingUpIcon className="w-4 h-4 text-success" /> : <TrendingUpIcon className="w-4 h-4 text-warning" />}
        </div>
        <p className="text-2xl font-semibold mt-2">{problematicDisplayValue}</p> 
        <span className={`text-sm ${btcDominanceChange >= 0 ? "text-success" : "text-warning"} flex items-center gap-1`}>
          {btcDominanceChange >= 0 ? (
            <ArrowUpIcon className="w-3 h-3" />
          ) : (
            <ArrowDownIcon className="w-3 h-3" />
          )}
          {Math.abs(btcDominanceChange).toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default MarketStats;
