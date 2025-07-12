# Payment Status Fix Documentation

## Issue Description

The payment status of "COMPLETE PAYMENT" was showing as "PENDING" in the Registration Management and Course Selections pages. This was due to inconsistencies between two different database collections:

1. **Registration Collection** - Contains both `status` (registration status) and `paymentStatus` (payment status)
2. **CourseRegForm Collection** - Contains only `status` (which represents payment status)

## Root Cause

The PayPal webhook was correctly updating both collections when payments were completed:
- Updates `CourseRegForm.status` to `COMPLETED`
- Updates `Registration.paymentStatus` to `COMPLETED`

However, there were cases where:
1. The webhook failed to update one of the collections
2. Records were created manually without proper payment status synchronization
3. The `orderId` field didn't match between collections

## Solution Implemented

### 1. Enhanced PayPal Webhook (`src/app/api/paypal/route.ts`)

- Added comprehensive logging to track webhook processing
- Added fallback logic to update Registration records by `registrationNumber` if `orderId` doesn't match
- Improved error handling and status reporting

### 2. Database Consistency Script (`scripts/fix-payment-status.ts`)

This script fixes existing inconsistencies by:

1. **Forward Sync**: For all Registration records with `paymentStatus: COMPLETED`, ensure corresponding CourseRegForm records have `status: COMPLETED`

2. **Reverse Sync**: For all CourseRegForm records with `status: COMPLETED`, ensure corresponding Registration records have `paymentStatus: COMPLETED`

### 3. How to Run the Fix

```bash
# Navigate to the project root
cd /path/to/ihu-usa

# Run the payment status fix script
npx tsx scripts/fix-payment-status.ts
```

## Verification

After running the fix, verify that:

1. **Registration Management** (`/admin/registrations`) shows correct payment status badges
2. **Course Selections** (`/admin/course-selections`) shows correct payment status badges
3. Both pages display consistent information for the same registrations

## Prevention

To prevent future inconsistencies:

1. The enhanced PayPal webhook now includes fallback logic
2. Consider implementing database transactions for multi-collection updates
3. Regular monitoring of payment status consistency
4. Consider adding a scheduled job to periodically check and fix inconsistencies

## Files Modified

- `src/app/api/paypal/route.ts` - Enhanced webhook with better logging and fallback logic
- `scripts/fix-payment-status.ts` - New script to fix existing inconsistencies
- `scripts/PAYMENT-STATUS-FIX.md` - This documentation file

## Status Field Mapping

| Collection | Field | Purpose | Values |
|------------|-------|---------|--------|
| Registration | `status` | Registration approval status | PENDING, APPROVED, REJECTED |
| Registration | `paymentStatus` | Payment completion status | PENDING, COMPLETED, FAILED, REFUNDED |
| CourseRegForm | `status` | Payment completion status | PENDING, COMPLETED, FAILED, REFUNDED |

## Notes

- The Course Selections page displays the `status` field from CourseRegForm collection
- The Registration Management page displays both `status` and `paymentStatus` fields from Registration collection
- Both should show consistent payment information for the same registration 