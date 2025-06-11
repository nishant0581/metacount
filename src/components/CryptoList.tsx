import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetchCryptoData = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false');
  if (!response.ok) {
    // Bug: Intentionally not throwing an error here, or returning null/undefined, to cause issues downstream
    // throw new Error('Network response was not ok'); 
    return undefined; // This will make cryptos undefined if the fetch fails
  }
  return response.json();
};

const CryptoList = () => {
  const { data: cryptos, isLoading, error } = useQuery({ // keep error for potential debugging by user
    queryKey: ['cryptos'],
    queryFn: fetchCryptoData,
    refetchInterval: 30000, 
  });

  if (isLoading) {
    return <div className="glass-card rounded-lg p-6 animate-pulse">Loading...</div>;
  }

  // Bug: If 'cryptos' is undefined due to fetch error, this .map will crash.
  // No explicit error UI is shown.
  // if (error) {
  //   return <div className="glass-card rounded-lg p-6 text-warning">Error loading data. Please try again later.</div>;
  // }
  // if (!cryptos) {
  //    return <div className="glass-card rounded-lg p-6">No data available.</div>;
  // }


  return (
    <div className="glass-card rounded-lg p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Top Cryptocurrencies</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="pb-4">Name</th>
              <th className="pb-4">Price</th>
              <th className="pb-4">24h Change</th>
              <th className="pb-4">Volume</th>
            </tr>
          </thead>
          <tbody>
            {/* This line will cause a runtime error if cryptos is undefined after loading */}
            {cryptos.map((crypto) => ( 
              <tr key={crypto.symbol} className="border-t border-secondary">
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">${crypto.current_price.toLocaleString()}</td>
                <td className="py-4">
                  <span
                    className={`flex items-center gap-1 ${
                      crypto.price_change_percentage_24h >= 0 ? "text-success" : "text-warning"
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </td>
                <td className="py-4">${(crypto.total_volume / 1e9).toFixed(1)}B</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoList;
