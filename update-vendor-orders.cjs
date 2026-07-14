const fs = require('fs');
let content = fs.readFileSync('src/components/VendorOrders.tsx', 'utf8');

// Add Payout Status header
content = content.replace(
  '<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>',
  '<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fulfillment</th>\n              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout</th>'
);

// Add Payout Status cell
content = content.replace(
  '<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">',
  `<td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={\`px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${
                    o.vendorOrder.payoutStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }\`}>
                    {o.vendorOrder.payoutStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">`
);

// Change colSpan if no orders found
content = content.replace('colSpan={5}', 'colSpan={6}');

fs.writeFileSync('src/components/VendorOrders.tsx', content);
