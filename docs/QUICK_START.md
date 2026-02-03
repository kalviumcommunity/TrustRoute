# Quick Start Guide - My Bookings Feature

## Prerequisites
- Docker installed and running
- Node.js 18+ installed
- PostgreSQL (via Docker Compose)

## 🚀 Setup & Testing (5 minutes)

### Step 1: Start the Database
```bash
cd /home/rkb/TrustRoute/TrustRoute
docker-compose up -d
```

Wait for PostgreSQL to be ready (~10 seconds).

### Step 2: Run Database Migrations
```bash
npx prisma migrate dev
```

This will:
- Create the database schema
- Add cancellation tracking fields
- Set up the refund transaction tables

### Step 3: Seed Test Data
```bash
npx prisma db seed
```

This creates:
- Test bus operators (RedBus Express, GreenLine, etc.)
- Refund policies
- Sample users

### Step 4: Start the Development Server
```bash
npm run dev
```

Server will start at: http://localhost:3000

## 🧪 Testing the Feature

### Test Scenario 1: Book a Ticket

1. **Sign up / Login**
   - Go to http://localhost:3000
   - Click "Start Now" or "Log In"
   - Create an account or login

2. **Book a Test Ticket**
   - From: `Mumbai`
   - To: `Pune`
   - Date: Tomorrow or any future date
   - Select a bus
   - Choose a seat (e.g., A1)
   - Enter passenger name
   - Confirm payment (mock payment)

3. **Verify Booking Created**
   - Click "My Bookings" in navbar
   - See your newly created booking
   - Check status: "Confirmed" (green badge)

### Test Scenario 2: Cancel with 95% Refund (>24h)

1. **Navigate to My Bookings**
   - Click "My Bookings" in the navbar

2. **Initiate Cancellation**
   - Find a confirmed booking with >24h until departure
   - Click "Cancel Ticket" button

3. **Review Refund Calculation**
   - Modal opens with booking details
   - See refund breakdown:
     - Original: ₹1000
     - Convenience Fee: -₹50 (5%)
     - Refund: ₹950 (95%)
   - Note: "More than 24 hours before departure"

4. **Confirm Cancellation**
   - Check the confirmation checkbox
   - Click "Confirm Cancellation"
   - See success message

5. **View Refund Timeline**
   - Click "View Refund Status" button
   - See Amazon-style timeline:
     - ✅ Booked (with timestamp)
     - ✅ Cancelled (with timestamp)
     - 🔵 Refund Initiated (current, with timestamp)
     - ⏳ Processing (pending)
     - ⏳ Credited (pending)

### Test Scenario 3: Cancel with Lower Refund (<24h)

To test different refund percentages, you need bookings with travel dates closer to now:

**For 75% refund (12-24h before):**
- Book a ticket with departure time 18 hours from now
- Cancel it → See ₹750 refund on ₹1000 ticket

**For 50% refund (3-12h before):**
- Book a ticket with departure time 6 hours from now
- Cancel it → See ₹500 refund on ₹1000 ticket

**For no refund (<3h before):**
- Book a ticket with departure time 1 hour from now
- Cancel it → See "No refund" message

## 📊 What to Verify

### ✅ Booking Display
- [ ] All bookings show in My Bookings page
- [ ] Booking cards display all details (operator, route, seat, passenger, date)
- [ ] Status badges are color-coded (green=confirmed, red=cancelled)
- [ ] Timestamps show in IST format
- [ ] Statistics cards show correct counts

### ✅ Cancellation Flow
- [ ] "Cancel Ticket" button only shows for confirmed future bookings
- [ ] Modal opens with booking details
- [ ] Refund calculation updates based on time remaining
- [ ] Breakdown shows all fees transparently
- [ ] Confirmation checkbox required to proceed
- [ ] Success message appears after cancellation

### ✅ Refund Timeline
- [ ] Timeline modal opens when clicking "View Refund Status"
- [ ] All stages display with correct icons
- [ ] Timestamps show for completed stages (Booked, Cancelled, Initiated)
- [ ] Current stage has animated pulse effect
- [ ] Pending stages show as grayed out
- [ ] Timeline is scrollable if needed

### ✅ Navigation
- [ ] Navbar shows "My Bookings" link when logged in
- [ ] Dashboard sidebar links to My Bookings
- [ ] Filters work (All / Confirmed / Cancelled)
- [ ] "Book Ticket" link redirects to dashboard

### ✅ Real-Time Data
- [ ] All timestamps are actual system time (not hardcoded)
- [ ] Refund amount changes based on cancellation time
- [ ] Timeline updates after cancellation
- [ ] Booking list refreshes after actions

## 🐛 Troubleshooting

### Database Connection Error
```
Error: P1001: Can't reach database server
```
**Solution:**
```bash
docker-compose up -d
# Wait 10 seconds, then retry
```

### Migration Error
```
Error: Migration failed
```
**Solution:**
```bash
docker-compose down -v  # Clear database
docker-compose up -d
npx prisma migrate dev --name init
npx prisma db seed
```

### Build Errors
```bash
npm install  # Reinstall dependencies
rm -rf .next  # Clear Next.js cache
npm run dev
```

### No Bookings Show Up
- Make sure you're logged in
- Check if user has any bookings
- Try creating a new booking from dashboard
- Check browser console for errors

## 📝 Test Data

After seeding, you'll have:

**Bus Operators:**
- RedBus Express
- GreenLine Travels
- SkyWay Transports

**Routes:**
- Mumbai → Pune
- Delhi → Jaipur
- Bangalore → Chennai

**Sample Users:**
- Use signup to create your own test user
- Or check `prisma/seed.ts` for any predefined users

## 🎯 Expected Results

### Successful Test Run Should Show:

1. **My Bookings Page**
   - Clean, organized layout with sidebar
   - User info at top of sidebar
   - Booking cards with all details
   - Working filter buttons

2. **Cancellation**
   - Modal with accurate refund calculation
   - All fees explained transparently
   - Smooth confirmation flow
   - Success message on completion

3. **Timeline**
   - Beautiful Amazon-style progress tracker
   - Real timestamps for completed stages
   - Clear visual hierarchy
   - Easy to understand at a glance

## 🎉 Success!

If you can:
- ✅ View your bookings
- ✅ Cancel a ticket and see exact refund amount
- ✅ View the refund timeline with real timestamps
- ✅ Filter bookings by status

**You're all set!** The feature is working correctly.

## 🔗 Next Steps

1. **Integrate Payment Gateway**
   - Add Razorpay/Stripe for real payments
   - Update refund status based on webhook events

2. **Add Notifications**
   - Email confirmations on booking/cancellation
   - SMS updates for timeline progress

3. **Production Deployment**
   - Set up environment variables
   - Configure production database
   - Enable SSL/HTTPS

## 📞 Support

For issues or questions:
- Check `/docs/MY_BOOKINGS_FEATURE.md` for detailed documentation
- Review `/docs/REFUND_POLICY.md` for refund policy details
- Check error logs in browser console and terminal

---

Happy Testing! 🚀
