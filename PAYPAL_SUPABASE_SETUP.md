# PayPal + Supabase Integration Setup

This integration connects PayPal sandbox payments to Supabase database to store payment information.

## Setup Instructions

### 1. Supabase Database Setup

1. Go to your Supabase dashboard: https://awngilvqwxukikhtfmjw.supabase.co
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql` into the SQL editor
4. Run the SQL to create the payments table and necessary indexes

### 2. Environment Configuration

The Supabase connection is already configured in `lib/supabase.ts` with your credentials:
- **Supabase URL**: https://awngilvqwxukikhtfmjw.supabase.co
- **Anon Key**: Used for client-side operations
- **Service Key**: Available for server-side operations if needed

### 3. PayPal Configuration

The PayPal integration uses:
- **Environment**: Sandbox (for testing)
- **Client ID**: BAAOHCbulRUVmHMknC1a_4b61NPbneAo719zsa5bMQkGI519Awb0CSNi0fQuHEokz7ZQckSm-erYGZshOY
- **Currency**: USD

## Features

### 1. Payment Processing
- Real-time PayPal payment processing
- Automatic storage of payment data in Supabase
- Support for both individual tool rentals and cart purchases

### 2. Payment Data Stored
- Payment ID (from PayPal)
- Payer information (ID, email, name)
- Amount and currency
- Payment status
- Tool/service details
- Customer information
- Timestamps

### 3. Payment Dashboard
Access the payment dashboard at `/payments` to view:
- All payment records from Supabase
- Payment statistics (total payments, revenue, completion rate)
- Detailed payment information
- Real-time data refresh

## File Structure

```
├── lib/
│   └── supabase.ts              # Supabase client and payment functions
├── components/ui/
│   └── PayPalButton.tsx         # Updated PayPal button with Supabase integration
├── src/app/
│   ├── payments/
│   │   └── page.tsx             # Payment dashboard page
│   ├── rent/[toolName]/
│   │   └── page.tsx             # Updated with payment tracking
│   └── cart/
│       └── page.tsx             # Updated with payment tracking
└── supabase-setup.sql           # Database schema and setup
```

## Testing

1. Start the development server: `npm run dev`
2. Navigate to any tool rental page or cart
3. Complete a PayPal sandbox payment
4. Check the `/payments` page to see the stored payment data
5. Verify data in your Supabase dashboard

## PayPal Sandbox Testing

Use PayPal sandbox test accounts:
- **Test Buyer Account**: Use any sandbox buyer account
- **Test Credit Card**: Use PayPal's test card numbers
- **Environment**: All transactions are in sandbox mode (no real money)

## Database Schema

### Payments Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| payment_id | VARCHAR(255) | PayPal payment ID (unique) |
| payer_id | VARCHAR(255) | PayPal payer ID |
| amount | DECIMAL(10,2) | Payment amount |
| currency | VARCHAR(3) | Currency code (USD) |
| status | VARCHAR(50) | Payment status (COMPLETED, PENDING, etc.) |
| tool_name | TEXT | Name of rented tool/service |
| quantity | INTEGER | Quantity purchased |
| duration | VARCHAR(100) | Rental duration |
| customer_email | VARCHAR(255) | Customer email |
| customer_name | VARCHAR(255) | Customer name |
| payment_method | VARCHAR(50) | Payment method (PayPal) |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify the Supabase URL and keys are correct
   - Check if the payments table exists
   - Ensure RLS policies are properly set

2. **PayPal SDK Not Loading**
   - Check network connectivity
   - Verify client ID is correct
   - Ensure script loading properly

3. **Payment Not Saving**
   - Check browser console for errors
   - Verify Supabase table permissions
   - Test Supabase connection separately

### Debug Mode

To enable debug logging, add this to your browser console:
```javascript
localStorage.setItem('debug', 'paypal,supabase');
```

## Security Notes

- The current setup uses the anon key for client-side operations
- Row Level Security (RLS) is enabled with permissive policies
- For production, consider implementing proper authentication and authorization
- PayPal sandbox credentials are used - replace with production credentials for live deployment

## Next Steps

1. Implement user authentication
2. Add payment status webhooks from PayPal
3. Create admin dashboard for payment management
4. Add email notifications for payments
5. Implement refund functionality
