-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "seatNumber" TEXT,
ADD COLUMN "passengerName" TEXT,
ADD COLUMN "travelDate" TIMESTAMP(3),
ADD COLUMN "route" TEXT,
ADD COLUMN "departureTime" TEXT,
ADD COLUMN "cancelledAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RefundTransaction" ADD COLUMN "initiatedAt" TIMESTAMP(3),
ADD COLUMN "processingAt" TIMESTAMP(3),
ADD COLUMN "creditedAt" TIMESTAMP(3),
ADD COLUMN "cancellationSlot" TEXT;
