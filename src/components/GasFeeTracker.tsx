
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Bitcoin as BitcoinIcon, AlertCircle, Loader2 } from "lucide-react";

// Define interfaces for the expected data structure from the API
interface BitcoinStatsData {
  suggested_transaction_fee_per_byte_sat?: number | null;
  // Add other fields if you use them from the API response
}

interface EthereumStatsDataContainer { // Renamed to avoid conflict if 'data' is used as prop
  data?: { // Bug: Nested 'data' property which might be null/undefined
    gas_price?: number | null; 
  }
  // Add other fields if you use them from the API response
}

const fetchBitcoinStats = async (): Promise<BitcoinStatsData> => {
  const response = await fetch("https://api.blockchair.com/bitcoin/stats");
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ context: { error: "Failed to parse error response" } }));
    throw new Error(errorData.context?.error || "Network response was not ok for Bitcoin stats");
  }
  const data = await response.json();
  return data.data; 
};

const fetchEthereumStats = async (): Promise<EthereumStatsDataContainer> => {
  const response = await fetch("https://api.blockchair.com/ethereum/stats");
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ context: { error: "Failed to parse error response" } }));
    // Bug: If error, this will cause ethereumData to be undefined, leading to issues below
    // throw new Error(errorData.context?.error || "Network response was not ok for Ethereum stats");
    return { data: undefined }; // Simulate a case where the structure is there, but data might be missing
  }
  // const data = await response.json(); // This would be the correct way
  // return data; // This would be the correct way
  return await response.json(); // Assume the entire response is EthereumStatsDataContainer
};

const GasFeeTracker = () => {
  const {
    data: bitcoinData,
    isLoading: isLoadingBitcoin,
    error: bitcoinError
  } = useQuery<BitcoinStatsData, Error>({
    queryKey: ["bitcoinStats"],
    queryFn: fetchBitcoinStats,
    refetchInterval: 60000, 
  });

  const {
    data: ethereumResponseData, // Changed variable name to reflect it's the whole response
    isLoading: isLoadingEthereum,
    error: ethereumError
  } = useQuery<EthereumStatsDataContainer, Error>({
    queryKey: ["ethereumStats"],
    queryFn: fetchEthereumStats,
    refetchInterval: 60000, 
  });

  const btcFee = bitcoinData?.suggested_transaction_fee_per_byte_sat;

  // Bug: Directly accessing ethereumResponseData.data.gas_price without checking if ethereumResponseData or ethereumResponseData.data is null/undefined.
  // This will crash if the API call in fetchEthereumStats fails and returns undefined, or if the structure is not as expected.
  const ethGasPriceGwei = (ethereumResponseData!.data!.gas_price! / 1e9).toFixed(0);
  // A safer way would be:
  // const ethGasPriceGwei = (ethereumResponseData?.data?.gas_price !== null && ethereumResponseData?.data?.gas_price !== undefined)
  //   ? (ethereumResponseData.data.gas_price / 1e9).toFixed(0)
  //   : null;


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
              <span className="text-sm" title={bitcoinError.message}>Error loading</span>
            </div>
          ) : (
            <div className="text-2xl font-bold">
              {btcFee !== null && btcFee !== undefined ? `${btcFee} sats/vB` : "N/A"}
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
          ) : ethereumError ? ( // This error display might not be reached if parsing crashes first
            <div className="flex items-center space-x-2 text-warning">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm" title={ethereumError.message}>Error loading</span>
            </div>
          ) : (
            // Bug: If ethGasPriceGwei crashes above, this won't render or will show stale data.
            // If ethGasPriceGwei calculation leads to "NaN Gwei" or similar, that's also a bug.
            <div className="text-2xl font-bold">
              {ethGasPriceGwei !== null && !isNaN(parseFloat(ethGasPriceGwei)) ? `${ethGasPriceGwei} Gwei` : "N/A"}
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
