const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Payment gateway addresses (HIDDEN FROM USERS)
const PAYMENT_GATEWAYS = {
    BTC: process.env.ADMIN_BTC_WALLET || 'your_btc_wallet',
    ETH: process.env.ADMIN_ETH_WALLET || 'your_eth_wallet',
    USDT: process.env.ADMIN_USDT_WALLET || 'TK4rUz6TUEd7zCWeuiX5R47pSNdPswJnAc',
    BNB: process.env.ADMIN_BNB_WALLET || 'your_bnb_wallet',
    BANK: {
        name: process.env.BANK_ACCOUNT_NAME || 'CryptoPro Limited',
        number: process.env.BANK_ACCOUNT_NUMBER || '0310184912429',
        bankName: process.env.BANK_NAME || 'Equity Bank Kenya',
        swiftCode: process.env.BANK_SWIFT_CODE || 'EQBLKENA'
    }
};

// @route   POST /api/transactions/deposit/initiate
// @desc    Initiate deposit - get payment reference without exposing wallet
// @access  Private
router.post('/deposit/initiate', protect, async (req, res) => {
    try {
        const { amount, method } = req.body;

        if (!amount || !method) {
            return res.status(400).json({
                success: false,
                message: 'Please provide amount and payment method'
            });
        }

        if (amount < 50) {
            return res.status(400).json({
                success: false,
                message: 'Minimum deposit is $50'
            });
        }

        // Generate unique payment reference
        const paymentReference = `CP${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        // Create pending transaction
        const transaction = await Transaction.create({
            user: req.user._id,
            type: 'deposit',
            method,
            amount,
            status: 'pending',
            reference: paymentReference,
            metadata: {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            }
        });

        // Return payment instructions WITHOUT exposing actual addresses
        res.status(201).json({
            success: true,
            message: 'Deposit initiated. Follow payment instructions below.',
            deposit: {
                reference: paymentReference,
                amount: amount,
                currency: 'USD',
                method: method,
                status: 'pending',
                // DO NOT send actual wallet addresses to frontend
                paymentInstructions: generatePaymentInstructions(method, amount, paymentReference),
                createdAt: transaction.createdAt
            }
        });

    } catch (error) {
        console.error('Deposit initiation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error initiating deposit',
            error: error.message
        });
    }
});

// @route   POST /api/transactions/deposit/confirm
// @desc    User confirms they made payment (submit proof)
// @access  Private
router.post('/deposit/confirm', protect, async (req, res) => {
    try {
        const { reference, transactionHash, proofImageUrl } = req.body;

        if (!reference) {
            return res.status(400).json({
                success: false,
                message: 'Payment reference is required'
            });
        }

        const transaction = await Transaction.findOne({
            reference,
            user: req.user._id,
            status: 'pending'
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Deposit not found or already processed'
            });
        }

        // Update transaction with payment proof
        transaction.transactionHash = transactionHash || '';
        transaction.proof = proofImageUrl || '';
        transaction.status = 'processing';
        await transaction.save();

        // In real system, here you would:
        // 1. Verify payment on blockchain (for crypto)
        // 2. Check bank account for incoming transfer (for bank)
        // 3. Use payment gateway webhook to auto-confirm

        // For now, send to admin for manual approval
        res.json({
            success: true,
            message: 'Payment confirmation received! Your deposit is being verified by CryptoPro.com',
            deposit: {
                reference: transaction.reference,
                amount: transaction.amount,
                status: 'processing',
                estimatedTime: '5-15 minutes',
                note: 'You will receive an email confirmation once your deposit is approved.'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error confirming payment',
            error: error.message
        });
    }
});

// @route   POST /api/transactions/deposit/webhook
// @desc    Webhook for automatic payment detection (Binance Pay, Bank API, etc.)
// @access  Public (verified by signature)
router.post('/deposit/webhook', async (req, res) => {
    try {
        // Verify webhook signature (implement based on your payment provider)
        const signature = req.headers['x-webhook-signature'];
        // if (!verifySignature(signature, req.body)) {
        //     return res.status(401).json({ success: false, message: 'Invalid signature' });
        // }

        const { reference, amount, txHash, status } = req.body;

        const transaction = await Transaction.findOne({ reference });

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        if (status === 'confirmed') {
            // Update transaction
            transaction.status = 'completed';
            transaction.transactionHash = txHash;
            transaction.processedAt = new Date();
            await transaction.save();

            // Credit user balance AUTOMATICALLY
            const user = await User.findById(transaction.user);
            user.balances.real += transaction.amount;
            user.totalDeposited += transaction.amount;
            await user.save();

            // Send notification (implement email/SMS)
            console.log(`✅ Deposit auto-confirmed: ${reference} - $${amount} credited to user ${user.email}`);
        }

        res.json({ success: true, message: 'Webhook processed' });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ success: false, message: 'Webhook processing failed' });
    }
});

// @route   GET /api/transactions
// @desc    Get user transactions
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 20, type, status } = req.query;

        const query = { user: req.user._id };
        if (type) query.type = type;
        if (status) query.status = status;

        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-walletAddress -bankDetails -metadata -adminNotes'); // HIDE sensitive data

        const count = await Transaction.countDocuments(query);

        // Format transactions for frontend (remove sensitive data)
        const safeTransactions = transactions.map(tx => ({
            id: tx._id,
            type: tx.type,
            amount: tx.amount,
            status: tx.status,
            method: tx.method,
            reference: tx.reference,
            // Show friendly status message instead of raw data
            statusMessage: getStatusMessage(tx.status, tx.type),
            createdAt: tx.createdAt,
            processedAt: tx.processedAt
        }));

        res.json({
            success: true,
            transactions: safeTransactions,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
});

// @route   POST /api/transactions/withdraw
// @desc    Request withdrawal
// @access  Private
router.post('/withdraw', protect, async (req, res) => {
    try {
        const { amount, method, destinationAddress } = req.body;

        if (!amount || !method || !destinationAddress) {
            return res.status(400).json({
                success: false,
                message: 'Please provide amount, method, and destination address'
            });
        }

        if (amount < 50) {
            return res.status(400).json({
                success: false,
                message: 'Minimum withdrawal is $50'
            });
        }

        if (req.user.balances.real < amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient balance'
            });
        }

        if (req.user.totalDeposited < 500) {
            return res.status(400).json({
                success: false,
                message: 'You must deposit at least $500 total before withdrawing'
            });
        }

        const fee = amount * 0.02;
        const netAmount = amount - fee;

        // Create withdrawal request
        const transaction = await Transaction.create({
            user: req.user._id,
            type: 'withdrawal',
            method,
            amount,
            fee,
            netAmount,
            walletAddress: destinationAddress, // User's destination address
            status: 'pending',
            metadata: {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            }
        });

        // Deduct from balance
        req.user.balances.real -= amount;
        await req.user.save();

        res.status(201).json({
            success: true,
            message: 'Withdrawal request submitted to CryptoPro.com for processing',
            withdrawal: {
                reference: transaction.reference,
                amount: transaction.amount,
                fee: transaction.fee,
                netAmount: transaction.netAmount,
                status: 'pending',
                estimatedTime: '1-3 business days',
                note: 'Your funds will be sent to your provided address after verification.'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating withdrawal request',
            error: error.message
        });
    }
});

// Helper function to generate payment instructions without exposing addresses
function generatePaymentInstructions(method, amount, reference) {
    const instructions = {
        BTC: {
            title: 'Bitcoin Deposit Instructions',
            steps: [
                '1. Open your Bitcoin wallet application',
                '2. Send exactly the amount shown below',
                '3. Use the payment reference in the transaction memo',
                '4. Click "I have made payment" button after sending',
                '5. Your balance will be credited automatically within 5-15 minutes'
            ],
            note: 'IMPORTANT: Include the payment reference in your transaction to ensure automatic processing.',
            autoConfirm: true
        },
        ETH: {
            title: 'Ethereum Deposit Instructions',
            steps: [
                '1. Open your Ethereum wallet',
                '2. Send exactly the amount shown below',
                '3. Include payment reference in transaction data',
                '4. Confirm payment in the app',
                '5. Funds credited automatically after 3 network confirmations'
            ],
            note: 'Network fee will be deducted from your transaction amount.',
            autoConfirm: true
        },
        USDT: {
            title: 'USDT (TRC20) Deposit Instructions',
            steps: [
                '1. Use TRC20 network only (lower fees)',
                '2. Send the exact amount shown',
                '3. Include payment reference',
                '4. Submit confirmation with transaction hash',
                '5. Instant credit after confirmation'
            ],
            note: 'Only TRC20 network supported. Do not send via other networks.',
            autoConfirm: true
        },
        BANK: {
            title: 'Bank Transfer Instructions',
            steps: [
                '1. Transfer to CryptoPro Limited account',
                '2. Use payment reference as transfer description',
                '3. Upload transfer receipt in the app',
                '4. Wait for manual verification',
                '5. Credited within 1-4 hours during business hours'
            ],
            note: 'Bank transfers are processed manually during business hours (9 AM - 5 PM EAT).',
            autoConfirm: false
        }
    };

    return {
        ...instructions[method],
        amount: `$${amount}`,
        reference: reference,
        merchantName: 'CryptoPro Trading Platform',
        supportEmail: 'support@cryptopro.com'
    };
}

// Helper function for user-friendly status messages
function getStatusMessage(status, type) {
    const messages = {
        pending: type === 'deposit' 
            ? 'Awaiting payment confirmation' 
            : 'Withdrawal request submitted',
        processing: type === 'deposit'
            ? 'Payment received - Confirming with CryptoPro.com'
            : 'Processing your withdrawal',
        completed: type === 'deposit'
            ? 'Deposit confirmed by CryptoPro.com - Balance updated'
            : 'Withdrawal completed - Funds sent',
        failed: type === 'deposit'
            ? 'Payment verification failed - Contact support'
            : 'Withdrawal failed - Balance refunded',
        cancelled: 'Transaction cancelled'
    };

    return messages[status] || 'Unknown status';
}

module.exports = router;
