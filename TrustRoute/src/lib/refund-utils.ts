export interface RefundSlab {
    hoursBefore: number;
    refundPercentage: number;
    label: string;
}

export interface RefundRules {
    slabs: RefundSlab[];
    fees: {
        convenience: number;
        operatorDelay: number;
    };
}

export function calculateRefund(amount: number, departureTime: Date, currentTime: Date = new Date(), rules: RefundRules) {
    const diffMs = departureTime.getTime() - currentTime.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);

    // Sort slabs by hoursBefore descending to find the highest matching slab
    const sortedSlabs = [...rules.slabs].sort((a, b) => b.hoursBefore - a.hoursBefore);

    let appliedSlab = sortedSlabs.find(slab => diffHrs >= slab.hoursBefore);

    // If no slab matches (e.g. less than 3 hours), default to no refund
    if (!appliedSlab) {
        appliedSlab = rules.slabs.find(s => s.hoursBefore === 0) || { hoursBefore: 0, refundPercentage: 0, label: 'Less than 3 hours' };
    }

    const refundAmount = (amount * appliedSlab.refundPercentage) / 100;
    const deductionTotal = amount - refundAmount;

    // Breakdown logic for receipt
    // As per policy.md: Convenience fee (5%) + Cancellation fee (rest)
    const convenienceFee = (amount * 5) / 100;
    const cancellationFee = Math.max(0, deductionTotal - convenienceFee);

    // Refined breakdown per policy.md
    const breakdown = {
        originalFare: amount,
        refundAmount,
        deductions: {
            convenience: diffHrs >= 24 ? deductionTotal : convenienceFee,
            cancellation: diffHrs >= 24 ? 0 : deductionTotal - convenienceFee,
        },
        appliedSlab: appliedSlab.label,
        timeDiffHrs: diffHrs.toFixed(1),
    };

    return {
        refundAmount,
        deductionTotal,
        breakdown,
        appliedSlab
    };
}
