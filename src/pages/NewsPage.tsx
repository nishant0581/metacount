
const NewsPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Crypto News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="glass-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">News Headline {item}</h2>
            <p className="text-muted-foreground text-sm mb-4">Date | Source</p>
            <p className="text-sm">
              This is a placeholder for a news article summary. Exciting crypto updates will appear here soon!
            </p>
            <a href="#" className="text-primary hover:underline mt-4 inline-block">Read more</a>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-muted-foreground">
        <p>News feed integration is planned.</p>
      </div>
    </div>
  );
};

export default NewsPage;
