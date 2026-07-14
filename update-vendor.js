const fs = require('fs');
const content = fs.readFileSync('src/api/vendors.ts', 'utf-8');

const newRoute = `
// Vendor updates their profile (bank details)
router.put('/me', requireAuth, requireVendor, async (req: any, res: any) => {
  try {
    const { shopName, description, bankName, bankAccountNumber, bankAccountName } = req.body;
    
    const updated = await db.update(vendors)
      .set({
        shopName,
        description,
        bankName,
        bankAccountNumber,
        bankAccountName,
      })
      .where(eq(vendors.userId, req.user.id))
      .returning();
      
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

`;

const updated = content.replace('export default router;', newRoute + 'export default router;');
fs.writeFileSync('src/api/vendors.ts', updated);
