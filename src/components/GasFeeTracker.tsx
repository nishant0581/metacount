
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Bitcoin as BitcoinIcon, AlertCircle, Loader2 } from "lucide-react"; // Renamed Bitcoin to BitcoinIcon to avoid conflict

const fetchBitcoinStats = async () => {
  const response = await fetch("https://api.blockchair.com/bitcoin/stats");
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.context?.error || "Network response was not ok for Bitcoin stats");
  }
  const data = await response.json();
  return data.data;
};

const fetchEthereumStats = async () => {
  const response = await fetch("https://api.blockchair.com/ethereum/stats");
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.context?.error || "Network response was not ok for Ethereum stats");
  }
  const data = await response.json();
  return data.data;
};

const GasFeeTracker = () => {
  const { 
    data: bitcoinData, 
    isLoading: isLoadingBitcoin, 
    error: bitcoinError 
  } = useQuery<{ suggested_transaction_fee_per_byte_sat: number }, Error>({
    queryKey: ["bitcoinStats"],
    queryFn: fetchBitcoinStats,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const { 
    data: ethereumData, 
    isLoading: isLoadingEthereum, 
    error: ethereumError 
  } = useQuery<{ gas_price: number }, Error>({
    queryKey: ["ethereumStats"],
    queryFn: fetchEthereumStats,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const ethGasPriceGwei = ethereumData?.gas_price ? (ethereumData.gas_price / 1e9).toFixed(0) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bitcoin Avg Fee</CardTitle>
          <BitcoinIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoadingBitcoin ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : bitcoinError ? (
            <div className="flex items-center space-x-2 text-warning">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">Error loading</span>
            </div>
          ) : (
            <div className="text-2xl font-bold">
              {bitcoinData?.suggested_transaction_fee_per_byte_sat} sats/vB
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Current average transaction fee
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ethereum Avg Gas</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoadingEthereum ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : ethereumError ? (
            <div className="flex items-center space-x-2 text-warning">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">Error loading</span>
            </div>
          ) : (
            <div className="text-2xl font-bold">
              {ethGasPriceGwei ? `${ethGasPriceGwei} Gwei` : "N/A"}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Current average gas price
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GasFeeTracker;
