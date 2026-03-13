

# Fix: Impostazioni page crash — TabsContent outside Tabs

## Problem
The page crashes with `TabsContent must be used within Tabs` because:
- `</Tabs>` closes at **line 670**
- `<NotificationPreferencesTab />` (which renders `<TabsContent value="preferenze-notifiche">`) is at **line 764**, outside the `<Tabs>` wrapper
- The two Dialog components (Cantieri assignment + Email Preview, lines 672-761) were placed between `</Tabs>` and `<NotificationPreferencesTab />`

## Fix

**File: `src/pages/Impostazioni.tsx`**

Move `<NotificationPreferencesTab />` from line 764 to just before `</Tabs>` at line 670. The two Dialog components can stay outside Tabs (they don't need Tabs context).

Concretely:
1. Remove line 763-764 (`{/* Tab Preferenze Notifiche */}` + `<NotificationPreferencesTab />`)
2. Insert `<NotificationPreferencesTab />` at line 669, just before `</Tabs>` (after the `notifiche-email` TabsContent closing)

This ensures all `TabsContent` components are children of the `<Tabs>` wrapper.

