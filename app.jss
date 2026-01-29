// ==================== CONFIGURATION ====================
const CONFIG = {
    ADMIN_PASSWORD: 'admin123',
    ADMIN_SECRET_KEY: 'CryptoPro2024Admin',
    AUTO_APPROVE_ALL: true,
    MINIMUM_DEPOSIT: 10,
    MINIMUM_BALANCE_FOR_TRADING: 50,
    MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL: 500,
    
    // AI Trading Bot Settings
    BOT_WIN_RATE: 0.75,
    BOT_PROFIT_RANGE: [0.03, 0.08],
    BOT_LOSS_RANGE: [0.01, 0.03],
    BOT_TRADE_INTERVAL: 30000,
    
    // COMPLETE PAYMENT METHODS WITH AUTO CURRENCY CONVERSION
    PAYMENT_METHODS: {
        // Cryptocurrencies
        crypto: {
            BTC: { 
                name: 'Bitcoin', 
                symbol: 'BTC', 
                rate: 64250, 
                icon: '₿', 
                address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
                network: 'Bitcoin Network'
            },
            ETH: { 
                name: 'Ethereum', 
                symbol: 'ETH', 
                rate: 3420, 
                icon: 'Ξ', 
                address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
                network: 'ERC-20'
            },
            USDT_TRC20: { 
                name: 'USDT (Tron)', 
                symbol: 'USDT', 
                rate: 1, 
                icon: '₮', 
                address: 'TXj1kD7ePQ9wN8mR5tH6vL2sK3pB4cF8gA',
                network: 'TRC-20 (Tron)'
            },
            USDT_ERC20: { 
                name: 'USDT (Ethereum)', 
                symbol: 'USDT', 
                rate: 1, 
                icon: '₮', 
                address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
                network: 'ERC-20 (Ethereum)'
            },
            BNB: { 
                name: 'BNB (Binance Coin)', 
                symbol: 'BNB', 
                rate: 580, 
                icon: '💰', 
                address: '0x28C6c06298d514Db089934071355E5743bf21d60',
                network: 'BSC (BEP-20)'
            }
        },
        
        // Digital Wallets
        digital: {
            PAYPAL: { 
                name: 'PayPal', 
                currency: 'USD',
                rate: 1, 
                email: 'payments@cryptopro.com', 
                icon: '💳',
                instructions: 'Send payment to our PayPal email and enter transaction ID'
            },
            CASHAPP: { 
                name: 'Cash App', 
                currency: 'USD',
                rate: 1, 
                cashtag: '$CryptoPro', 
                icon: '💵',
                instructions: 'Send to our Cash App tag and provide transaction ID'
            },
            VENMO: { 
                name: 'Venmo', 
                currency: 'USD',
                rate: 1, 
                username: '@cryptopro', 
                icon: '💰',
                instructions: 'Send to our Venmo username with note "Deposit"'
            },
            ZELLE: { 
                name: 'Zelle', 
                currency: 'USD',
                rate: 1, 
                email: 'pay@cryptopro.com', 
                icon: '⚡',
                instructions: 'Send via Zelle to our email address'
            }
        },
        
        // Mobile Money (African & Asian Markets)
        mobile: {
            MPESA: { 
                name: 'M-Pesa (Kenya)', 
                currency: 'KES',
                rate: 0.0076,  // 1 KES = $0.0076 USD
                country: 'Kenya 🇰🇪',
                number: '+254712345678', 
                businessName: 'CryptoPro Ltd',
                icon: '📱',
                instructions: 'Send to Paybill/Till Number, then enter transaction code'
            },
            MTN: { 
                name: 'MTN Mobile Money (Uganda)', 
                currency: 'UGX',
                rate: 0.00027,  // 1 UGX = $0.00027 USD
                country: 'Uganda 🇺🇬',
                number: '+256700000000',
                icon: '📱',
                instructions: 'Send Mobile Money and provide transaction reference'
            },
            AIRTEL: { 
                name: 'Airtel Money (Nigeria)', 
                currency: 'NGN',
                rate: 0.00065,  // 1 NGN = $0.00065 USD
                country: 'Nigeria 🇳🇬',
                number: '+2348012345678',
                icon: '📱',
                instructions: 'Transfer via Airtel Money and share transaction ID'
            },
            GCASH: { 
                name: 'GCash (Philippines)', 
                currency: 'PHP',
                rate: 0.018,  // 1 PHP = $0.018 USD
                country: 'Philippines 🇵🇭',
                number: '+639171234567',
                icon: '📱',
                instructions: 'Send via GCash and provide reference number'
            },
            PAYTM: { 
                name: 'Paytm (India)', 
                currency: 'INR',
                rate: 0.012,  // 1 INR = $0.012 USD
                country: 'India 🇮🇳',
                number: '+919876543210',
                icon: '📱',
                instructions: 'Send via Paytm UPI and share transaction ID'
            }
        },
        
        // Bank Transfers (International)
        bank: {
            USA: {
                name: 'US Bank Transfer',
                currency: 'USD',
                rate: 1,
                country: 'USA 🇺🇸',
                bankName: 'Chase Bank',
                accountNumber: '1234567890',
                routingNumber: '021000021',
                accountName: 'CryptoPro LLC',
                icon: '🏦'
            },
            UK: {
                name: 'UK Bank Transfer',
                currency: 'GBP',
                rate: 1.27,  // 1 GBP = $1.27 USD
                country: 'United Kingdom 🇬🇧',
                bankName: 'Barclays Bank',
                accountNumber: '12345678',
                sortCode: '20-00-00',
                accountName: 'CryptoPro Ltd',
                icon: '🏦'
            },
            EU: {
                name: 'EU Bank Transfer (SEPA)',
                currency: 'EUR',
                rate: 1.08,  // 1 EUR = $1.08 USD
                country: 'European Union 🇪🇺',
                bankName: 'Deutsche Bank',
                iban: 'DE89370400440532013000',
                swift: 'DEUTDEFF',
                accountName: 'CryptoPro GmbH',
                icon: '🏦'
            }
        },
        
        // Gift Cards
        giftcards: {
            AMAZON: { 
                name: 'Amazon Gift Card', 
                currency: 'USD',
                rate: 0.85,  // We pay 85% of card value
                icon: '🎁',
                instructions: 'Upload card image or enter code. We pay 85% of face value.'
            },
            ITUNES: { 
                name: 'iTunes/Apple Gift Card', 
                currency: 'USD',
                rate: 0.80,
                icon: '🍎',
                instructions: 'Enter card code. We pay 80% of face value.'
            },
            GOOGLE: { 
                name: 'Google Play Card', 
                currency: 'USD',
                rate: 0.82,
                icon: '🎮',
                instructions: 'Enter card code. We pay 82% of face value.'
            },
            STEAM: { 
                name: 'Steam Gift Card', 
                currency: 'USD',
                rate: 0.80,
                icon: '🎮',
                instructions: 'Enter card code. We pay 80% of face value.'
            }
        }
    }
};

// ==================== APP STATE ====================
let appState = {
    accountType: 'demo',
    isAdmin: false,
    demoBalance: 10000,
    realBalance: 0,
    displayBalance: 0,
    adminWallet: 0,
    pendingDeposits: [],
    approvedDeposits: [],
    pendingWithdrawals: [],
    userTotalDeposited: 0,
    transactions: [],
    activeTrades: [],
    totalDeposited: 0,
    totalWithdrawn: 0,
    paymentHistory: [],
    tradingProfits: 0,
    botEnabled: false,
    botTrades: 0,
    botProfits: 0
};

// ==================== MARKET PRICES ====================
let cryptoPrices = {
    'BTC/USDT': 64250, 'ETH/USDT': 3420, 'BNB/USDT': 580,
    'SOL/USDT': 145, 'XRP/USDT': 0.52, 'DOGE/USDT': 0.08,
    'ADA/USDT': 0.45, 'AVAX/USDT': 35.50,
    'GOLD/USD': 2050, 'SILVER/USD': 24.50, 'PLATINUM/USD': 920,
    'EUR/USD': 1.08, 'GBP/USD': 1.27, 'USD/JPY': 149.50, 'AUD/USD': 0.66,
    'AAPL': 189.50, 'TSLA': 245.30, 'GOOGL': 142.80, 'MSFT': 415.20, 'AMZN': 178.60, 'NVDA': 722.40
};

let priceChanges = {
    'BTC/USDT': 2.45, 'ETH/USDT': -1.23, 'BNB/USDT': 0.89, 'SOL/USDT': 3.12, 'XRP/USDT': -0.45
};

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('💎 CryptoPro - Enhanced Payment System');
    loadState();
    updateUI();
    startLiveUpdates();
    attachEventListeners();
    checkAdminStatus();
});

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
    console.log('Attaching event listeners...');
    
    setTimeout(() => {
        // Find and attach deposit buttons
        const depositSelectors = [
            '.btn-deposit',
            '[class*="deposit"]',
            'button:has-text("DEPOSIT")',
            '[onclick*="deposit"]'
        ];
        
        document.querySelectorAll('button, a, div[onclick]').forEach(el => {
            const text = el.textContent.toUpperCase();
            if (text.includes('DEPOSIT')) {
                el.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openDepositPage();
                    return false;
                };
                el.style.cursor = 'pointer';
                console.log('✅ Deposit button found and attached');
            }
            if (text.includes('WITHDRAW')) {
                el.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openWithdrawModal();
                    return false;
                };
                el.style.cursor = 'pointer';
                console.log('✅ Withdraw button found and attached');
            }
            if (text.includes('TRADE')) {
                el.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openTradeModal('BTC/USDT');
                    return false;
                };
                el.style.cursor = 'pointer';
                console.log('✅ Trade button found and attached');
            }
        });
    }, 500);
}

// Make functions global
window.openDepositPage = openDepositPage;
window.openWithdrawModal = openWithdrawModal;
window.openTradeModal = openTradeModal;
window.switchAccount = switchAccount;

// ==================== STEP-BY-STEP DEPOSIT PAGE ====================
function openDepositPage() {
    console.log('🚀 Opening deposit page...');
    
    if (appState.accountType === 'demo') {
        if (confirm('⚠️ DEMO MODE\n\nSwitch to REAL MONEY to deposit?\n\nClick OK to switch.')) {
            switchAccount('real');
            setTimeout(() => openDepositPage(), 300);
        }
        return;
    }
    
    // STEP 1: Enter Amount
    showStep1_EnterAmount();
}

function showStep1_EnterAmount() {
    const modal = createModal('depositModal');
    modal.innerHTML = `
        <div class="modal-content" style="background: #1a1a2e; border-radius: 16px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <h2 style="margin: 0; font-size: 22px;">💰 Deposit - Step 1 of 3</h2>
                <button onclick="closeDepositModal()" style="background: none; border: none; color: white; font-size: 32px; cursor: pointer; position: absolute; right: 20px; top: 15px;">×</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">✨ INSTANT DEPOSIT</div>
                    <div style="font-size: 13px; opacity: 0.9;">Enter amount → Choose payment → Pay in your currency → Done!</div>
                </div>
                
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 12px; font-size: 16px; font-weight: 600;">💵 How much do you want to deposit?</label>
                    <input 
                        type="number" 
                        id="depositAmount" 
                        placeholder="Enter amount in USD" 
                        min="${CONFIG.MINIMUM_DEPOSIT}" 
                        step="0.01"
                        style="width: 100%; padding: 16px; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; font-size: 24px; font-weight: bold; text-align: center;"
                    >
                    <div style="text-align: center; margin-top: 12px; font-size: 13px; opacity: 0.7;">
                        Minimum: $${CONFIG.MINIMUM_DEPOSIT} USD
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
                    <button onclick="setQuickAmount(50)" style="padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">$50</button>
                    <button onclick="setQuickAmount(100)" style="padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">$100</button>
                    <button onclick="setQuickAmount(500)" style="padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">$500</button>
                </div>
                
                <button onclick="goToStep2_SelectPayment()" style="width: 100%; padding: 18px; background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%); border: none; border-radius: 12px; color: #000; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,255,136,0.3);">
                    NEXT: Choose Payment Method →
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function setQuickAmount(amount) {
    document.getElementById('depositAmount').value = amount;
}

function goToStep2_SelectPayment() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    
    if (!amount || amount < CONFIG.MINIMUM_DEPOSIT) {
        alert(`❌ Please enter at least $${CONFIG.MINIMUM_DEPOSIT}`);
        return;
    }
    
    // Store amount
    sessionStorage.setItem('depositAmount', amount);
    
    // Show step 2
    showStep2_SelectPayment(amount);
}

function showStep2_SelectPayment(amount) {
    const modal = document.getElementById('depositModal');
    modal.innerHTML = `
        <div class="modal-content" style="background: #1a1a2e; border-radius: 16px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <h2 style="margin: 0; font-size: 22px;">💳 Deposit - Step 2 of 3</h2>
                <button onclick="closeDepositModal()" style="background: none; border: none; color: white; font-size: 32px; cursor: pointer; position: absolute; right: 20px; top: 15px;">×</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <div style="background: rgba(0,255,136,0.1); border: 2px solid rgba(0,255,136,0.3); padding: 16px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
                    <div style="font-size: 14px; opacity: 0.8;">You're depositing</div>
                    <div style="font-size: 32px; font-weight: bold; color: #00ff88; margin: 8px 0;">$${amount.toFixed(2)} USD</div>
                    <button onclick="showStep1_EnterAmount()" style="background: none; border: none; color: #00ff88; font-size: 13px; cursor: pointer; text-decoration: underline;">Change amount</button>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 16px;">Choose Your Payment Method:</h3>
                    
                    <!-- Cryptocurrency -->
                    <div class="payment-category" onclick="selectCategory('crypto', ${amount})" style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin-bottom: 12px; cursor: pointer; border: 2px solid rgba(255,255,255,0.1); transition: all 0.3s;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="font-size: 32px;">🪙</div>
                                <div>
                                    <div style="font-weight: bold; font-size: 16px;">Cryptocurrency</div>
                                    <div style="font-size: 12px; opacity: 0.7;">Bitcoin, USDT, Ethereum, BNB</div>
                                </div>
                            </div>
                            <div style="font-size: 20px;">→</div>
                        </div>
                    </div>
                    
                    <!-- Mobile Money -->
                    <div class="payment-category" onclick="selectCategory('mobile', ${amount})" style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin-bottom: 12px; cursor: pointer; border: 2px solid rgba(255,255,255,0.1);">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="font-size: 32px;">📱</div>
                                <div>
                                    <div style="font-weight: bold; font-size: 16px;">Mobile Money</div>
                                    <div style="font-size: 12px; opacity: 0.7;">M-Pesa, MTN, Airtel, GCash, Paytm</div>
                                </div>
                            </div>
                            <div style="font-size: 20px;">→</div>
                        </div>
                    </div>
                    
                    <!-- Digital Wallets -->
                    <div class="payment-category" onclick="selectCategory('digital', ${amount})" style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin-bottom: 12px; cursor: pointer; border: 2px solid rgba(255,255,255,0.1);">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="font-size: 32px;">💳</div>
                                <div>
                                    <div style="font-weight: bold; font-size: 16px;">Digital Wallets</div>
                                    <div style="font-size: 12px; opacity: 0.7;">PayPal, Cash App, Venmo, Zelle</div>
                                </div>
                            </div>
                            <div style="font-size: 20px;">→</div>
                        </div>
                    </div>
                    
                    <!-- Bank Transfer -->
                    <div class="payment-category" onclick="selectCategory('bank', ${amount})" style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin-bottom: 12px; cursor: pointer; border: 2px solid rgba(255,255,255,0.1);">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="font-size: 32px;">🏦</div>
                                <div>
                                    <div style="font-weight: bold; font-size: 16px;">Bank Transfer</div>
                                    <div style="font-size: 12px; opacity: 0.7;">USA, UK, EU, International</div>
                                </div>
                            </div>
                            <div style="font-size: 20px;">→</div>
                        </div>
                    </div>
                    
                    <!-- Gift Cards -->
                    <div class="payment-category" onclick="selectCategory('giftcards', ${amount})" style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; cursor: pointer; border: 2px solid rgba(255,255,255,0.1);">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="font-size: 32px;">🎁</div>
                                <div>
                                    <div style="font-weight: bold; font-size: 16px;">Gift Cards</div>
                                    <div style="font-size: 12px; opacity: 0.7;">Amazon, iTunes, Google Play, Steam</div>
                                </div>
                            </div>
                            <div style="font-size: 20px;">→</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function selectCategory(category, amount) {
    const methods = CONFIG.PAYMENT_METHODS[category];
    showStep3_SelectMethod(category, amount, methods);
}

function showStep3_SelectMethod(category, amount, methods) {
    const modal = document.getElementById('depositModal');
    
    let methodsHTML = '';
    for (const [key, method] of Object.entries(methods)) {
        const amountInCurrency = amount / method.rate;
        const currencyDisplay = method.currency || method.symbol || 'USD';
        
        methodsHTML += `
            <div class="payment-method" onclick="selectPaymentMethod('${category}', '${key}', ${amount})" style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin-bottom: 12px; cursor: pointer; border: 2px solid rgba(255,255,255,0.1);">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 28px;">${method.icon}</div>
                        <div>
                            <div style="font-weight: bold; font-size: 15px;">${method.name}</div>
                            <div style="font-size: 12px; opacity: 0.7;">${method.country || method.network || 'Available'}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: bold; color: #00ff88;">${amountInCurrency.toFixed(method.currency ? 2 : 8)} ${currencyDisplay}</div>
                        <div style="font-size: 11px; opacity: 0.6;">= $${amount.toFixed(2)} USD</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div class="modal-content" style="background: #1a1a2e; border-radius: 16px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <h2 style="margin: 0; font-size: 22px;">💎 Select Payment - Step 3 of 3</h2>
                <button onclick="closeDepositModal()" style="background: none; border: none; color: white; font-size: 32px; cursor: pointer; position: absolute; right: 20px; top: 15px;">×</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <div style="background: rgba(0,255,136,0.1); padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                    <div style="font-size: 13px; opacity: 0.8;">Depositing: <strong>$${amount.toFixed(2)} USD</strong></div>
                </div>
                
                <button onclick="showStep2_SelectPayment(${amount})" style="background: none; border: none; color: #00ff88; font-size: 13px; cursor: pointer; margin-bottom: 16px; text-decoration: underline;">← Back to categories</button>
                
                <h3 style="margin: 0 0 16px 0; font-size: 16px;">Choose Specific Method:</h3>
                
                ${methodsHTML}
            </div>
        </div>
    `;
}

function selectPaymentMethod(category, methodKey, amount) {
    const method = CONFIG.PAYMENT_METHODS[category][methodKey];
    showPaymentDetails(category, methodKey, method, amount);
}

function showPaymentDetails(category, methodKey, method, amount) {
    const amountInCurrency = amount / method.rate;
    const currencyDisplay = method.currency || method.symbol || 'USD';
    
    let paymentInstructionsHTML = '';
    
    // Build instructions based on payment type
    if (category === 'crypto') {
        paymentInstructionsHTML = `
            <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 12px; margin: 16px 0;">
                <div style="font-weight: bold; margin-bottom: 12px; font-size: 15px;">📬 Send ${method.symbol} to this address:</div>
                <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                    <div style="font-size: 11px; opacity: 0.6; margin-bottom: 6px;">Network: ${method.network}</div>
                    <code style="word-break: break-all; font-size: 13px; display: block; margin-bottom: 12px;">${method.address}</code>
                    <button onclick="copyToClipboard('${method.address}')" style="padding: 8px 16px; background: rgba(0,255,136,0.2); border: 1px solid #00ff88; border-radius: 6px; color: #00ff88; cursor: pointer; width: 100%;">
                        📋 Copy Address
                    </button>
                </div>
            </div>
        `;
    } else if (category === 'mobile') {
        paymentInstructionsHTML = `
            <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 12px; margin: 16px 0;">
                <div style="font-weight: bold; margin-bottom: 12px; font-size: 15px;">📱 ${method.name}</div>
                <div style="margin-bottom: 8px;">
                    <strong>Send to:</strong> <code style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px;">${method.number}</code>
                </div>
                ${method.businessName ? `<div style="margin-bottom: 8px;"><strong>Business:</strong> ${method.businessName}</div>` : ''}
                <div style="margin: 12px 0; padding: 12px; background: rgba(255,165,0,0.1); border-radius: 8px;">
                    <strong>📝 Instructions:</strong><br>
                    ${method.instructions}
                </div>
            </div>
        `;
    } else if (category === 'digital') {
        paymentInstructionsHTML = `
            <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 12px; margin: 16px 0;">
                <div style="font-weight: bold; margin-bottom: 12px; font-size: 15px;">💳 ${method.name}</div>
                ${method.email ? `<div style="margin-bottom: 8px;"><strong>Email:</strong> <code>${method.email}</code></div>` : ''}
                ${method.cashtag ? `<div style="margin-bottom: 8px;"><strong>CashTag:</strong> <code>${method.cashtag}</code></div>` : ''}
                ${method.username ? `<div style="margin-bottom: 8px;"><strong>Username:</strong> <code>${method.username}</code></div>` : ''}
                <div style="margin: 12px 0; padding: 12px; background: rgba(255,165,0,0.1); border-radius: 8px; font-size: 13px;">
                    ${method.instructions}
                </div>
            </div>
        `;
    } else if (category === 'bank') {
        paymentInstructionsHTML = `
            <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 12px; margin: 16px 0;">
                <div style="font-weight: bold; margin-bottom: 12px; font-size: 15px;">🏦 ${method.name}</div>
                <div style="margin-bottom: 8px;"><strong>Bank:</strong> ${method.bankName}</div>
                ${method.accountNumber ? `<div style="margin-bottom: 8px;"><strong>Account:</strong> <code>${method.accountNumber}</code></div>` : ''}
                ${method.routingNumber ? `<div style="margin-bottom: 8px;"><strong>Routing:</strong> <code>${method.routingNumber}</code></div>` : ''}
                ${method.iban ? `<div style="margin-bottom: 8px;"><strong>IBAN:</strong> <code>${method.iban}</code></div>` : ''}
                ${method.swift ? `<div style="margin-bottom: 8px;"><strong>SWIFT:</strong> <code>${method.swift}</code></div>` : ''}
                <div style="margin-bottom: 8px;"><strong>Name:</strong> ${method.accountName}</div>
            </div>
        `;
    } else if (category === 'giftcards') {
        const cardValue = Math.ceil(amountInCurrency);
        paymentInstructionsHTML = `
            <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 12px; margin: 16px 0;">
                <div style="font-weight: bold; margin-bottom: 12px; font-size: 15px;">🎁 ${method.name}</div>
                <div style="background: rgba(255,165,0,0.1); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                    <strong>Card Value Needed:</strong> $${cardValue}<br>
                    <small style="opacity: 0.7;">We pay ${(method.rate * 100).toFixed(0)}% of face value = $${amount.toFixed(2)} USD</small>
                </div>
                <div style="font-size: 13px; opacity: 0.8;">
                    ${method.instructions}
                </div>
            </div>
        `;
    }
    
    const modal = document.getElementById('depositModal');
    modal.innerHTML = `
        <div class="modal-content" style="background: #1a1a2e; border-radius: 16px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <h2 style="margin: 0; font-size: 22px;">✅ Complete Payment</h2>
                <button onclick="closeDepositModal()" style="background: none; border: none; color: white; font-size: 32px; cursor: pointer; position: absolute; right: 20px; top: 15px;">×</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <!-- Amount Summary -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">💱 Auto Currency Conversion</div>
                    <div style="font-size: 28px; font-weight: bold; margin: 12px 0;">${amountInCurrency.toFixed(method.currency ? 2 : 8)} ${currencyDisplay}</div>
                    <div style="font-size: 14px; opacity: 0.9;">= $${amount.toFixed(2)} USD</div>
                </div>
                
                <!-- Payment Instructions -->
                ${paymentInstructionsHTML}
                
                <!-- Transaction Reference -->
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">🔖 Transaction Reference / ID *</label>
                    <input 
                        type="text" 
                        id="transactionRef" 
                        placeholder="Enter transaction ID, receipt number, or reference code"
                        style="width: 100%; padding: 14px; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-size: 14px;"
                    >
                    <div style="font-size: 12px; opacity: 0.6; margin-top: 6px;">Required to verify your payment</div>
                </div>
                
                <!-- Submit Button -->
                <button 
                    onclick="confirmDeposit('${category}', '${methodKey}', ${amount}, '${method.name}')"
                    style="width: 100%; padding: 18px; background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%); border: none; border-radius: 12px; color: #000; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,255,136,0.4);"
                >
                    ✅ I'VE SENT ${amountInCurrency.toFixed(method.currency ? 2 : 8)} ${currencyDisplay} - CONFIRM DEPOSIT
                </button>
                
                <div style="text-align: center; margin-top: 16px;">
                    <button onclick="selectCategory('${category}', ${amount})" style="background: none; border: none; color: rgba(255,255,255,0.5); font-size: 13px; cursor: pointer;">← Choose different method</button>
                </div>
            </div>
        </div>
    `;
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ Address copied to clipboard!');
        }).catch(() => {
            prompt('Copy this address:', text);
        });
    } else {
        prompt('Copy this address:', text);
    }
}

function confirmDeposit(category, methodKey, amount, methodName) {
    const reference = document.getElementById('transactionRef').value.trim();
    
    if (!reference) {
        alert('❌ Please enter transaction reference/ID to confirm your payment');
        return;
    }
    
    // Credit balances instantly
    appState.displayBalance += amount;
    appState.realBalance += amount;
    appState.adminWallet += amount;
    appState.userTotalDeposited += amount;
    appState.totalDeposited += amount;
    
    appState.paymentHistory.push({
        id: Date.now(),
        amount: amount,
        method: methodName,
        category: category,
        reference: reference,
        timestamp: new Date().toISOString(),
        status: 'APPROVED'
    });
    
    appState.transactions.push({
        id: Date.now(),
        type: 'DEPOSIT',
        amount: amount,
        method: methodName,
        reference: reference,
        timestamp: new Date().toISOString()
    });
    
    saveState();
    updateUI();
    closeDepositModal();
    
    // Success animation
    showSuccessAnimation();
    
    setTimeout(() => {
        alert(`✅ DEPOSIT SUCCESSFUL!\n\n💰 Amount: $${amount.toFixed(2)} USD\n📱 Method: ${methodName}\n🔖 Ref: ${reference}\n\n🎉 NEW BALANCE: $${appState.displayBalance.toFixed(2)}\n\nYour funds are ready to trade!`);
    }, 1500);
}

function showSuccessAnimation() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); display: flex; align-items: center;
        justify-content: center; z-index: 10001; animation: fadeIn 0.3s;
    `;
    overlay.innerHTML = `
        <div style="text-align: center; animation: bounceIn 0.6s;">
            <div style="font-size: 100px; margin-bottom: 20px;">✅</div>
            <div style="font-size: 36px; font-weight: bold; color: #00ff88; margin-bottom: 10px;">APPROVED!</div>
            <div style="font-size: 18px; color: white; opacity: 0.9;">Funds credited instantly</div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.animation = 'fadeOut 0.3s';
        setTimeout(() => overlay.remove(), 300);
    }, 2000);
}

function closeDepositModal() {
    const modal = document.getElementById('depositModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s';
        setTimeout(() => modal.remove(), 300);
    }
}

function createModal(id) {
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal active';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); display: flex; align-items: center;
        justify-content: center; z-index: 10000; animation: fadeIn 0.3s;
        overflow-y: auto; padding: 20px 0;
    `;
    return modal;
}

// ==================== OTHER FUNCTIONS (SIMPLIFIED) ====================

function checkAdminStatus() {
    const adminKey = sessionStorage.getItem('adminAuth');
    if (adminKey === CONFIG.ADMIN_SECRET_KEY) {
        appState.isAdmin = true;
        showAdminPanel();
    }
}

function promptAdminLogin() {
    const password = prompt('🔐 Admin Password:');
    if (password === CONFIG.ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', CONFIG.ADMIN_SECRET_KEY);
        appState.isAdmin = true;
        showAdminPanel();
        alert('✅ Admin Access!');
    }
}

function showAdminPanel() {
    const btn = document.createElement('button');
    btn.innerHTML = '👑';
    btn.style.cssText = 'position:fixed;top:10px;right:10px;padding:12px 20px;background:#667eea;color:white;border:none;border-radius:25px;cursor:pointer;z-index:1000;';
    btn.onclick = () => alert(`Admin Wallet: $${appState.adminWallet.toFixed(2)}\nUser Balance: $${appState.displayBalance.toFixed(2)}`);
    if (!document.querySelector('[style*="top:10px;right:10px"]')) document.body.appendChild(btn);
}

function openWithdrawModal() {
    if (appState.accountType === 'demo') {
        alert('Switch to REAL account');
        return;
    }
    if (appState.userTotalDeposited < CONFIG.MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL) {
        const needed = CONFIG.MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL - appState.userTotalDeposited;
        if (confirm(`Need $${needed.toFixed(2)} more in deposits to unlock withdrawals. Deposit now?`)) {
            openDepositPage();
        }
    } else {
        alert('Withdrawal request submitted! Processing: 1-3 business days');
    }
}

function openTradeModal(pair) {
    alert(`Trade ${pair} - Feature coming soon!`);
}

function switchAccount(type) {
    appState.accountType = type;
    saveState();
    updateUI();
}

function loadState() {
    const saved = localStorage.getItem('cryptoProApp');
    if (saved) {
        try {
            appState = { ...appState, ...JSON.parse(saved), isAdmin: false };
        } catch (e) {}
    }
}

function saveState() {
    const toSave = { ...appState };
    delete toSave.isAdmin;
    localStorage.setItem('cryptoProApp', JSON.stringify(toSave));
}

function updateUI() {
    const balance = appState.isAdmin ? appState.adminWallet : (appState.accountType === 'demo' ? appState.demoBalance : appState.displayBalance);
    const el = document.getElementById('totalBalance');
    if (el) el.textContent = '$' + balance.toFixed(2);
}

function startLiveUpdates() {
    setInterval(() => {
        Object.keys(cryptoPrices).forEach(pair => {
            cryptoPrices[pair] *= (1 + (Math.random() - 0.5) * 0.002);
        });
    }, 2000);
}

// Add CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); opacity: 1; }
    }
    .payment-category:hover, .payment-method:hover {
        border-color: #00ff88 !important;
        transform: scale(1.02);
    }
    .modal-content { -webkit-overflow-scrolling: touch; }
`;
document.head.appendChild(style);

console.log('✅ Enhanced deposit system ready!');
