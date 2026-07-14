const fs = require('fs');
let content = fs.readFileSync('src/components/VendorOrders.tsx', 'utf8');

// The file already has loading state `const [loading, setLoading] = useState(true);`
// Let's check how it handles it. It probably does `if (loading) return <div>Loading...</div>;`
content = content.replace(
  "if (loading) return <div>Loading orders...</div>;",
  `if (loading) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );`
);

fs.writeFileSync('src/components/VendorOrders.tsx', content);

let content2 = fs.readFileSync('src/components/CustomerOrders.tsx', 'utf8');
content2 = content2.replace(
  "if (loading) return <div>Loading orders...</div>;",
  `if (loading) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );`
);
fs.writeFileSync('src/components/CustomerOrders.tsx', content2);
