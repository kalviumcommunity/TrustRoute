# 🎫 My Bookings & Cancellation Timeline - Complete Feature Package

## 🎯 What This Feature Does

TrustRoute's **My Bookings & Cancellation Timeline** feature provides users with complete transparency and control over their bus ticket bookings and cancellations. Inspired by Amazon's order tracking, this feature builds trust through:

- 📋 Clear visibility of all bookings
- 💰 Transparent refund calculations
- ⏱️ Real-time cancellation & refund tracking
- 🎨 Amazon-style timeline interface
- ✅ Controlled cancellation flow

---

## 📦 Package Contents

This complete implementation includes:

### **Frontend Components** (4 files)
1. **My Bookings Page** - `/src/app/my-bookings/page.tsx`
   - Full dashboard with sidebar navigation
   - Booking statistics and filters
   - User profile display

2. **Booking Card** - `/src/components/BookingCard.tsx`
   - Individual booking display
   - Status badges and actions
   - Refund information

3. **Cancellation Modal** - `/src/components/CancellationModal.tsx`
   - Confirmation dialog
   - Live refund calculation
   - Fee breakdown display

4. **Refund Timeline** - `/src/components/RefundTimeline.tsx`
   - Amazon-style progress tracker
   - 5-stage progression
   - Real timestamps

### **Backend APIs** (1 file)
1. **Cancellation API** - `/src/app/api/bookings/cancel/route.ts`
   - GET: Refund preview
   - POST: Execute cancellation
   - Timeline initialization

### **Database Schema** (Modified)
1. **Prisma Schema** - `/prisma/schema.prisma`
   - Cancellation tracking fields
   - Refund transaction model
   - Timeline storage

### **Documentation** (5 files)
1. **Feature Documentation** - `/docs/MY_BOOKINGS_FEATURE.md`
2. **Quick Start Guide** - `/docs/QUICK_START.md`
3. **User Flow Diagram** - `/docs/USER_FLOW_DIAGRAM.md`
4. **Deployment Checklist** - `/docs/DEPLOYMENT_CHECKLIST.md`
5. **Implementation Summary** - `/docs/IMPLEMENTATION_SUMMARY.md`
6. **This README** - `/docs/README_MY_BOOKINGS.md`

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
```bash
# Ensure you have:
- Docker & Docker Compose
- Node.js 18+
- PostgreSQL (via Docker)
```

### Installation & Setup

```bash
# 1. Navigate to project
cd /home/rkb/TrustRoute/TrustRoute

# 2. Start database
docker-compose up -d

# 3. Run migrations
npx prisma migrate dev

# 4. Seed test data
npx prisma db seed

# 5. Start development server
npm run dev
```

### Access the Feature

1. Open http://localhost:3000
2. Sign up or login
3. Book a test ticket from dashboard
4. Navigate to **My Bookings** (navbar or sidebar)
5. Cancel a booking to see the full flow

**Detailed instructions**: See [QUICK_START.md](./QUICK_START.md)

---

## 💡 Key Features

### 1️⃣ **Smart Booking Display**
- View all your bookings in one place
- Filter by status (All / Confirmed / Cancelled)
- Quick stats (Total, Confirmed, Cancelled counts)
- Color-coded status badges
- Complete booking details on each card

### 2️⃣ **Transparent Cancellation**
- One-click cancel from booking card
- Real-time refund calculation
- Transparent fee breakdown:
  - Original amount
  - Convenience fee (5%)
  - Cancellation fee (time-based)
  - Final refund amount
- Confirmation checkbox required
- Option to keep booking

### 3️⃣ **Time-Based Refund Policy**

| When You Cancel | Refund % | Example (₹1000) |
|-----------------|----------|-----------------|
| > 24 hours before | 95% | ₹950 |
| 12-24 hours before | 75% | ₹750 |
| 3-12 hours before | 50% | ₹500 |
| < 3 hours before | 0% | ₹0 |

### 4️⃣ **Amazon-Style Timeline**
After cancellation, track your refund through 5 stages:

1. **🟢 Booked** - Original booking timestamp
2. **🟡 Cancelled** - Cancellation confirmation
3. **🔵 Refund Initiated** - Immediate, with amount
4. **🟣 Processing** - Bank verification (1-2 days)
5. **✅ Credited** - Final credit (3-5 days)

Each stage shows:
- Status icon (completed/current/pending)
- Real timestamp (when available)
- Clear description
- Visual progress indicator

### 5️⃣ **User-Centric Design**
- No hidden fees or charges
- All deductions explained upfront
- Real timestamps (no estimates)
- Familiar Amazon-style interface
- Mobile-responsive design
- Clear error messages
- Loading states for all actions

---

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Authentication**: JWT (cookie-based)

### Backend Stack
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Custom JWT with cookies

### Data Flow

```
User Action → Frontend Component → API Route → Database
     ↓              ↓                  ↓          ↓
View Bookings → My Bookings Page → GET /api/bookings → Prisma Query
Cancel Booking → Cancel Modal → POST /api/bookings/cancel → Update DB
View Timeline → Timeline Modal → (Uses cached data) → Render stages
```

---

## 📖 API Documentation

### GET `/api/bookings`
Fetch all bookings for logged-in user.

**Auth**: Required (JWT cookie)

**Response**:
```json
{
  "bookings": [
    {
      "id": "clxxx",
      "amount": 1000,
      "status": "CONFIRMED",
      "createdAt": "2026-02-02T10:30:00Z",
      "operator": { "name": "RedBus Express" },
      "refundTransaction": null
    }
  ]
}
```

### GET `/api/bookings/cancel?bookingId=xxx`
Preview refund without cancelling.

**Auth**: Required

**Response**:
```json
{
  "refund": {
    "refundAmount": 950,
    "deductionTotal": 50,
    "refundPercentage": 95,
    "slot": "More than 24 hours before departure",
    "breakdown": {
      "originalAmount": 1000,
      "convenienceFee": 50,
      "cancellationFee": 0,
      "refundAmount": 950
    }
  }
}
```

### POST `/api/bookings/cancel`
Cancel booking and initiate refund.

**Auth**: Required

**Request**:
```json
{
  "bookingId": "clxxx"
}
```

**Response**:
```json
{
  "message": "Booking cancelled successfully",
  "booking": { /* updated booking */ },
  "refund": { /* refund calculation */ }
}
```

---

## 🗂️ File Structure

```
TrustRoute/
├── docs/
│   ├── MY_BOOKINGS_FEATURE.md          # Feature documentation
│   ├── QUICK_START.md                  # Setup guide
│   ├── USER_FLOW_DIAGRAM.md            # Visual flow
│   ├── DEPLOYMENT_CHECKLIST.md         # Deploy checklist
│   ├── IMPLEMENTATION_SUMMARY.md       # Summary
│   └── README_MY_BOOKINGS.md           # This file
├── prisma/
│   └── schema.prisma                   # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── bookings/
│   │   │       ├── route.ts            # Booking CRUD
│   │   │       └── cancel/
│   │   │           └── route.ts        # Cancellation logic
│   │   └── my-bookings/
│   │       └── page.tsx                # Main page
│   └── components/
│       ├── BookingCard.tsx             # Booking display
│       ├── CancellationModal.tsx       # Confirmation modal
│       ├── RefundTimeline.tsx          # Timeline tracker
│       └── Navbar.tsx                  # Updated nav
└── README.md                           # Project root README
```

---

## 🎨 UI/UX Design Principles

### 1. **Transparency First**
Every rupee accounted for. No hidden charges. All fees explained.

### 2. **User Control**
Confirmation required for destructive actions. Easy to back out.

### 3. **Familiar Patterns**
Amazon-style tracking. Color-coded status. Standard icons.

### 4. **Real-Time Data**
Live calculations. Actual timestamps. No estimates or mocks.

### 5. **Clear Communication**
Simple language. Helpful messages. Obvious next steps.

---

## 🧪 Testing Guide

### Manual Test Cases

#### Test 1: View Bookings
1. Login to application
2. Navigate to My Bookings
3. Verify all bookings display
4. Check status badges are correct
5. Verify statistics are accurate

#### Test 2: Filter Bookings
1. Click "All Bookings" - see all
2. Click "Confirmed" - see only confirmed
3. Click "Cancelled" - see only cancelled
4. Verify counts match

#### Test 3: Cancel Booking (>24h)
1. Find confirmed booking with >24h until departure
2. Click "Cancel Ticket"
3. Verify refund shows 95%
4. Check convenience fee = 5%
5. Confirm cancellation
6. Verify status changes to "Cancelled"
7. Check refund amount displays

#### Test 4: Cancel Booking (<24h)
1. Book ticket departing in 18 hours
2. Cancel immediately
3. Verify refund shows 75%
4. Check fee breakdown
5. Confirm and verify

#### Test 5: View Timeline
1. Cancel a booking
2. Click "View Refund Status"
3. Verify timeline shows 5 stages
4. Check Booked stage has timestamp
5. Check Cancelled stage has timestamp
6. Check Initiated stage is current
7. Check Processing and Credited are pending

#### Test 6: Edge Cases
- [ ] Try to cancel already cancelled booking (should fail)
- [ ] Try to cancel past booking (should fail)
- [ ] Try to cancel someone else's booking (should fail)
- [ ] View bookings when none exist (should show empty state)
- [ ] Cancel with <3h remaining (should show no refund)

### Automated Tests (TODO)
```typescript
// Example test structure
describe('My Bookings Feature', () => {
  it('should display user bookings', async () => {
    // Test implementation
  });
  
  it('should calculate refund correctly', async () => {
    // Test implementation
  });
  
  it('should prevent unauthorized cancellation', async () => {
    // Test implementation
  });
});
```

---

## 🚀 Deployment

### Development Environment
```bash
npm run dev
# Access at http://localhost:3000
```

### Production Deployment

1. **Pre-deployment**
   ```bash
   # Run checks
   npm run build
   npm run lint
   npx prisma validate
   ```

2. **Database Migration**
   ```bash
   # Backup first!
   pg_dump > backup.sql
   
   # Run migration
   npx prisma migrate deploy
   ```

3. **Deploy Application**
   ```bash
   # Example: Vercel
   vercel --prod
   
   # Example: Docker
   docker build -t trustroute .
   docker run -p 3000:3000 trustroute
   ```

4. **Post-deployment Testing**
   - Verify all pages load
   - Test booking flow
   - Test cancellation flow
   - Check error logs

**Full checklist**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/trustroute"

# Auth
JWT_SECRET="your-secret-key"

# Optional
NODE_ENV="production"
```

### Prisma Configuration
```typescript
// prisma.config.ts
export default {
  provider: 'postgresql',
  // ... configuration
};
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: P1001: Can't reach database server
```
**Solution**: Start Docker Compose
```bash
docker-compose up -d
```

#### 2. Migration Failed
```
Error: Migration failed
```
**Solution**: Reset database
```bash
docker-compose down -v
docker-compose up -d
npx prisma migrate dev
```

#### 3. Refund Calculation Wrong
- Check travel date is in the future
- Verify system time is correct
- Review refund policy logic in API

#### 4. Timeline Not Showing
- Ensure booking is cancelled
- Check refundTransaction exists
- Verify timeline JSON structure

---

## 📊 Analytics & Monitoring

### Metrics to Track
- Number of bookings viewed
- Cancellation rate (%)
- Average refund amount
- Time window distribution
- Timeline views
- User drop-off points

### Logging
```typescript
// Example logging points
console.log('Booking cancelled:', { bookingId, refundAmount });
console.log('Timeline viewed:', { bookingId, userId });
```

---

## 🔮 Future Enhancements

### Phase 2 (Planned)
- [ ] Email notifications on each timeline stage
- [ ] SMS updates for refund progress
- [ ] Auto-update refund status (cron job)
- [ ] Payment gateway integration
- [ ] Instant wallet refunds

### Phase 3 (Ideas)
- [ ] Partial cancellations (cancel individual seats)
- [ ] Refund to wallet option
- [ ] Refund dispute system
- [ ] Export booking history
- [ ] Print/download tickets
- [ ] Reschedule option (instead of cancel)

---

## 🤝 Contributing

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Use Prettier for formatting

### Pull Request Process
1. Create feature branch
2. Implement changes
3. Add tests (if applicable)
4. Update documentation
5. Submit PR with description

---

## 📝 License

This feature is part of the TrustRoute project. See main project LICENSE file.

---

## 👥 Credits

**Developer**: @BalajiRKB  
**Project**: TrustRoute  
**Feature**: My Bookings & Cancellation Timeline  
**Date**: February 2026  
**Version**: 1.0.0

---

## 📞 Support

### Documentation
- [Feature Documentation](./MY_BOOKINGS_FEATURE.md)
- [Quick Start Guide](./QUICK_START.md)
- [User Flow Diagram](./USER_FLOW_DIAGRAM.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

### Contact
- **GitHub Issues**: [Create issue](https://github.com/trustroute/issues)
- **Email**: support@trustroute.com
- **Slack**: #trustroute-support

---

## ⭐ Key Differentiators

What makes TrustRoute's cancellation experience better:

| Feature | Competitors | TrustRoute |
|---------|-------------|------------|
| Refund Transparency | ❌ Hidden/vague | ✅ Every fee explained |
| Cancellation Flow | ❌ One-click (accidental) | ✅ Confirmation required |
| Progress Tracking | ❌ Email only | ✅ Real-time timeline |
| Fee Breakdown | ❌ Unclear | ✅ Itemized breakdown |
| User Control | ❌ Limited | ✅ Full visibility & control |

---

## 🎉 Summary

This feature delivers a **trust-first cancellation experience** where users:
- ✅ See exactly what they're getting back
- ✅ Understand why fees were deducted
- ✅ Track refund progress in real-time
- ✅ Feel confident in the platform

**Result**: Higher user satisfaction, lower support tickets, increased trust.

---

**Built with ❤️ for transparency, trust, and user confidence.**

*Last Updated: February 2, 2026*
