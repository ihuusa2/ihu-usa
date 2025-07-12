# Payment Status Update System Guide

## Overview

This guide explains how the payment status is automatically updated to "COMPLETED" in the database when a user successfully completes a payment. The system implements a multi-layered approach to ensure reliable payment status updates.

## System Architecture

### 1. Database Collections

The system uses two main collections for payment tracking:

- **Registration Collection**: Contains `paymentStatus` field for payment completion status
- **CourseRegForm Collection**: Contains `status` field for payment completion status
- **Donate Collection**: Contains `status` field for donation payment status

### 2. Payment Status Values

```typescript
export const enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}
```

## Payment Flow and Status Updates

### 1. Registration Form Payment Flow

**File**: `src/app/(Applications)/Registration-Form/Checkout/InitiatePayment.tsx`

When a user completes payment through the registration form:

1. **Payment Processing**: PayPal processes the payment
2. **Registration Creation**: `createRegisterForm()` creates registration with `orderId`
3. **Immediate Status Update**: API call to `/api/payments/update-status` updates status to COMPLETED
4. **Webhook Backup**: PayPal webhook provides additional confirmation
5. **Success Redirect**: User is redirected to success page

```typescript
const handleCart = async (orderId: string) => {
    try {
        setIsProcessing(true)
        
        // Create registration with orderId
        const result = await createRegisterForm({
            ...registration,
            orderId,
        })
        
        // Immediately update payment status to COMPLETED
        try {
            const updateResponse = await fetch('/api/payments/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: orderId,
                    status: 'COMPLETED'
                })
            });

            if (!updateResponse.ok) {
                console.warn('Failed to update payment status immediately, but webhook will handle it');
            } else {
                console.log('Payment status updated to COMPLETED immediately');
            }
        } catch (updateError) {
            console.warn('Error updating payment status immediately:', updateError);
            // Don't fail the entire process - webhook will handle the update
        }
        
        route.push('/Success')
    } catch (error) {
        console.error('Error creating registration:', error)
        alert('There was an error processing your registration. Please try again.')
    } finally {
        setIsProcessing(false)
    }
}
```

### 2. Course Selection Payment Flow

**File**: `src/app/Cart/InitiatePayment.tsx`

When a user completes payment for course selections:

1. **Payment Processing**: PayPal processes the payment
2. **Course Registration Creation**: `createMultiCourseRegForm()` creates course registrations
3. **Immediate Status Update**: API call to `/api/payments/update-status` updates status to COMPLETED
4. **Webhook Backup**: PayPal webhook provides additional confirmation
5. **Success Redirect**: User is redirected to success page

```typescript
const handleCart = async (orderId: string) => {
    try {
        setIsProcessing(true)
        
        // Create course registrations with orderId
        await createMultiCourseRegForm(cart?.map(item => ({
            orderId,
            registrationNumber: item.registrationNumber,
            course: item.course,
            program: item.program,
            subjects: item.subjects,
            price: {
                amount: item.price.amount,
                currency: item.price.type // Map type to currency
            },
            createdAt: new Date(),
            status: PaymentStatus.PENDING
        })))
        
        // Immediately update payment status to COMPLETED
        try {
            const updateResponse = await fetch('/api/payments/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: orderId,
                    status: 'COMPLETED'
                })
            });

            if (!updateResponse.ok) {
                console.warn('Failed to update payment status immediately, but webhook will handle it');
            } else {
                console.log('Payment status updated to COMPLETED immediately');
            }
        } catch (updateError) {
            console.warn('Error updating payment status immediately:', updateError);
            // Don't fail the entire process - webhook will handle the update
        }
        
        route.push('/Success')
    } catch (error) {
        console.error('Error creating course registrations:', error)
        alert('There was an error processing your course registrations. Please try again.')
    } finally {
        setIsProcessing(false)
    }
}
```

### 3. Donation Payment Flow

**File**: `src/app/Donate/page.tsx`

When a user completes a donation payment:

1. **Payment Processing**: PayPal processes the payment
2. **Donation Creation**: `createDonateForm()` creates donation record
3. **Immediate Status Update**: API call to `/api/donations/update-status` updates status to COMPLETED
4. **Webhook Backup**: PayPal webhook provides additional confirmation
5. **Success Message**: User sees success message

```typescript
const handlePaymentSuccess = async (response: PaypalResponse) => {
    try {
        // Update donation status to completed
        const updateResponse = await fetch('/api/donations/update-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                donationId: donationId,
                status: 'COMPLETED',
                transactionId: response.id || response.purchase_units?.[0]?.payments?.captures?.[0]?.id
            })
        });

        if (!updateResponse.ok) {
            throw new Error('Failed to update donation status');
        }

        setMsg('Thank you for your generous donation! Your contribution makes a difference in advancing education and building a better future.');
        setValue(initialValue);
        setCustomAmount(false);
        setFieldErrors({});
        setShowPaymentModal(false);
    } catch (err) {
        setError('Payment successful but failed to update donation status. Please contact support.');
        console.error('Payment success error:', err);
    }
};
```

## API Endpoints

### 1. Payment Status Update API

**Endpoint**: `POST /api/payments/update-status`

Updates payment status for registrations and course registrations.

**Request Body**:
```json
{
    "registrationId": "string", // Optional
    "email": "string", // Optional
    "registrationNumber": "string", // Optional
    "orderId": "string", // Optional
    "status": "COMPLETED" // Required: PENDING, COMPLETED, FAILED, REFUNDED
}
```

**Response**:
```json
{
    "success": true,
    "message": "Payment status updated to COMPLETED successfully",
    "details": {
        "registrationsUpdated": 1,
        "courseRegFormsUpdated": 1
    }
}
```

### 2. Donation Status Update API

**Endpoint**: `POST /api/donations/update-status`

Updates donation payment status.

**Request Body**:
```json
{
    "donationId": "string", // Required
    "status": "COMPLETED", // Required
    "transactionId": "string", // Optional
    "orderId": "string" // Optional
}
```

## PayPal Webhook Integration

**File**: `src/app/api/paypal/route.ts`

The PayPal webhook provides a backup mechanism for payment status updates:

### Webhook Events Handled

1. **PAYMENT.SALE.COMPLETED**: Updates payment status to COMPLETED
2. **CHECKOUT.ORDER.APPROVED**: Updates payment status to COMPLETED
3. **PAYMENT.SALE.DENIED**: Updates payment status to FAILED

### Webhook Processing

```typescript
case 'PAYMENT.SALE.COMPLETED':
    console.log('💰 Processing PAYMENT.SALE.COMPLETED for orderId:', event.resource.id);
    
    // Update payment status for completed payments
    const courseUpdateResult = await CourseRegForm.updateMany({ orderId: event.resource.id }, {
        $set: {
            status: PaymentStatus.COMPLETED,
            transactionId: event.resource.id,
        }
    });
    console.log('📚 CourseRegForm update result:', courseUpdateResult);

    const regUpdateResult = await Registration.updateMany({ orderId: event.resource.id }, {
        $set: {
            paymentStatus: PaymentStatus.COMPLETED
        }
    });
    console.log('📝 Registration update result:', regUpdateResult);

    // Also update by registration number if orderId doesn't match
    if (regUpdateResult.matchedCount === 0) {
        console.log('⚠️ No Registration found with orderId, trying to find by registration number...');
        const courseData = await CourseRegForm.find({ orderId: event.resource.id }).toArray();
        if (courseData.length > 0) {
            const registrationNumbers = courseData.map(course => course.registrationNumber);
            const regByNumberResult = await Registration.updateMany(
                { registrationNumber: { $in: registrationNumbers } },
                { $set: { paymentStatus: PaymentStatus.COMPLETED } }
            );
            console.log('📝 Registration update by registration number result:', regByNumberResult);
        }
    }

    // Handle donation payments
    const donationUpdateResult1 = await Donate.updateMany({ transactionId: event.resource.id }, {
        $set: {
            status: DonationStatus.COMPLETED,
            transactionId: event.resource.id,
        }
    });
    console.log('💝 Donation update result:', donationUpdateResult1);
    break;
```

## Database Consistency

### 1. Dual Update Strategy

The system updates both collections to ensure consistency:

- **Registration Collection**: Updates `paymentStatus` field
- **CourseRegForm Collection**: Updates `status` field

### 2. Fallback Mechanisms

- **OrderId Matching**: Primary method using PayPal order ID
- **Registration Number Matching**: Fallback when orderId doesn't match
- **Webhook Backup**: Ensures updates even if immediate API calls fail

### 3. Consistency Scripts

**File**: `scripts/fix-payment-status.ts`

Runs periodically to fix any inconsistencies between collections:

```bash
npx tsx scripts/fix-payment-status.ts
```

## Testing

### 1. Test Script

**File**: `scripts/test-payment-status-update.ts`

Tests the payment status update APIs:

```bash
npx tsx scripts/test-payment-status-update.ts
```

### 2. Manual Testing

1. Complete a payment through the registration form
2. Check admin panel for payment status
3. Verify both Registration and CourseRegForm collections
4. Test webhook by simulating PayPal events

## Monitoring and Logging

### 1. Console Logs

The system provides comprehensive logging:

- Payment processing steps
- Database update results
- Error handling
- Webhook processing

### 2. Error Handling

- Graceful degradation if immediate updates fail
- Webhook backup ensures eventual consistency
- User-friendly error messages
- Detailed error logging for debugging

## Best Practices

### 1. Reliability

- **Dual Update Strategy**: Updates both collections
- **Immediate + Webhook**: Two update mechanisms
- **Fallback Matching**: Multiple ways to find records
- **Error Handling**: Graceful failure handling

### 2. Performance

- **Async Processing**: Non-blocking payment flows
- **Efficient Queries**: Optimized database updates
- **Minimal API Calls**: Only necessary updates

### 3. Security

- **Input Validation**: Validates all API inputs
- **Status Validation**: Only allows valid status values
- **Webhook Verification**: Verifies PayPal webhook signatures

## Troubleshooting

### Common Issues

1. **Payment Status Not Updated**
   - Check webhook configuration
   - Verify PayPal webhook URL
   - Check console logs for errors

2. **Inconsistent Status Between Collections**
   - Run consistency fix script
   - Check orderId matching
   - Verify registration number consistency

3. **Webhook Not Receiving Events**
   - Verify webhook URL in PayPal dashboard
   - Check webhook signature verification
   - Monitor webhook logs

### Debug Commands

```bash
# Check payment status consistency
npx tsx scripts/fix-payment-status.ts

# Test payment status update APIs
npx tsx scripts/test-payment-status-update.ts

# Manual payment status fix
npx tsx scripts/manual-payment-fix.ts
```

## Conclusion

The payment status update system ensures that when a user successfully completes a payment, the payment status is immediately updated to "COMPLETED" in the database through multiple mechanisms:

1. **Immediate API Updates**: Direct database updates after successful payment
2. **PayPal Webhook Backup**: Automatic updates via PayPal webhooks
3. **Consistency Scripts**: Periodic fixes for any inconsistencies
4. **Comprehensive Logging**: Full visibility into the update process

This multi-layered approach provides maximum reliability and ensures that payment statuses are always accurately reflected in the database. 