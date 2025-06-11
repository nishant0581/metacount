
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';


const CoinDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app, you would fetch coin details using the 'id'
  // For now, it's just a placeholder.

  return (
    <div className="container mx-auto p-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-3xl capitalize">Coin Detail: {id || 'Unknown Coin'}</CardTitle>
          <CardDescription>Detailed information about {id || 'this cryptocurrency'}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Price Chart</h3>
              <div className="h-[300px] bg-muted/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart placeholder for {id}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Market Stats</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Market Cap:</strong> Placeholder</li>
                <li><strong>24h Volume:</strong> Placeholder</li>
                <li><strong>Circulating Supply:</strong> Placeholder</li>
                <li><strong>Total Supply:</strong> Placeholder</li>
                <li><strong>All-Time High:</strong> Placeholder</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">About {id || 'this coin'}</h3>
            <p className="text-muted-foreground">
              Detailed description and project information will be displayed here. 
              This section will provide insights into the coin's technology, use cases, and team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoinDetailPage;
