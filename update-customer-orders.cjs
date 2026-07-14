const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerOrders.tsx', 'utf8');

content = content.replace("import { supabase } from '../lib/supabase';", "import { useAuth as useClerkAuth } from '@clerk/clerk-react';");
content = content.replace("export default function CustomerOrders() {\n  const { user } = useAuth();\n  const [orders, setOrders] = useState<any[]>([]);", "export default function CustomerOrders() {\n  const { user } = useAuth();\n  const { getToken } = useClerkAuth();\n  const [orders, setOrders] = useState<any[]>([]);");

content = content.replace("const { data: { session } } = await supabase.auth.getSession();\n    const token = session?.access_token;", "const token = await getToken();");

fs.writeFileSync('src/components/CustomerOrders.tsx', content);
