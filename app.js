<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CryptoPro - African Payment Gateway</title>
    <style>
        /* ===================== RESET & BASE ===================== */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
            color: #ffffff;
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* ===================== PAGE SWITCHING ===================== */
        .page { display: none; min-height: 100vh; }
        .page.active { display: block; }

        /* ===================== HOME PAGE STYLES ===================== */
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }

        .header {
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #00ff88, #00d9ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .live-indicator {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(0,255,136,0.1);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            margin-top: 8px;
        }
        .live-dot {
            width: 8px; height: 8px;
            background: #00ff88;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%,100% { opacity: 1; }
            50%      { opacity: 0.5; }
        }

        .balance-card {
            background: linear-gradient(135deg, #00ff88 0%, #00d9ff 100%);
            border-radius: 20px;
            padding: 32px;
            margin-bottom: 24px;
            box-shadow: 0 8px 32px rgba(0,255,136,0.2);
        }
        .balance-amount { font-size: 48px; font-weight: bold; color: #0a0e27; margin-bottom: 8px; }
        .balance-label  { color: rgba(10,14,39,0.8); font-size: 14px; }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px,1fr));
            gap: 16px;
            margin-bottom: 24px;
        }
        .stat-card {
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 24px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .stat-card .stat-value { font-size: 32px; font-weight: bold; margin-bottom: 8px; color: #00ff88; }
        .stat-card .stat-label { color: rgba(255,255,255,0.7); font-size: 14px; }

        .action-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
            gap: 16px;
            margin-bottom: 24px;
        }

        /* ===================== BUTTONS ===================== */
        .btn {
            padding: 16px 24px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            width: 100%;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,255,136,0.3); }

        .btn-primary   { background: linear-gradient(135deg, #00ff88, #00d9ff); color: #0a0e27; }
        .btn-secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
        .btn-secondary:hover { background: rgba(255,255,255,0.15); }
        .btn-dashboard { background: linear-gradient(135deg, #a855f7, #7c3aed); color: #fff; }
        .btn-trade     { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
        .btn-bot       { background: linear-gradient(135deg, #a855f7, #7c3aed); color: #fff; }
        .btn-deposit   { background: linear-gradient(135deg, #00d9ff, #0099cc); color: #fff; }
        .btn-withdraw  { background: linear-gradient(135deg, #ff006e, #cc0055); color: #fff; }

        /* ===================== MODALS ===================== */
        .modal {
            display: none;
            position: fixed; top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(8px);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-y: auto;
        }
        .modal.active { display: flex; }
        .modal-content {
            background: linear-gradient(135deg, #1a1f3a 0%, #0a0e27 100%);
            border-radius: 24px;
            padding: 32px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 16px 64px rgba(0,0,0,0.5);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        .modal-header h2 { font-size: 24px; color: #00ff88; }
        .close-btn {
            background: rgba(255,255,255,0.1);
            border: none; color: white;
            font-size: 24px;
            width: 40px; height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .close-btn:hover { background: rgba(255,255,255,0.2); transform: rotate(90deg); }

        /* ===================== FORM ===================== */
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; color: rgba(255,255,255,0.9); font-weight: 500; font-size: 13px; text-transform: uppercase; }
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%; padding: 14px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            background: rgba(255,255,255,0.05);
            color: white; font-size: 16px; font-family: inherit;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus { outline: none; border-color: #00ff88; background: rgba(255,255,255,0.08); }

        /* ===================== PAYMENT METHODS GRID ===================== */
        .payment-methods {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px,1fr));
            gap: 12px;
            margin-bottom: 24px;
        }
        .payment-method {
            padding: 16px;
            border: 2px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            cursor: pointer;
            text-align: center;
            transition: all 0.3s ease;
            background: rgba(255,255,255,0.03);
        }
        .payment-method:hover { border-color: #00ff88; background: rgba(0,255,136,0.05); }
        .payment-method.selected { border-color: #00ff88; background: rgba(0,255,136,0.1); }
        .payment-method-icon { font-size: 28px; margin-bottom: 8px; }
        .payment-method-name { font-size: 13px; font-weight: 600; }

        /* ===================== INFO / WARNING BOXES ===================== */
        .success-box { background: rgba(0,255,136,0.1); border: 1px solid #00ff88; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
        .warning-box { background: rgba(255,193,7,0.1); border: 1px solid #ffc107; border-radius: 12px; padding: 16px; margin-bottom: 20px; color: #ffc107; font-size: 14px; line-height: 1.6; }
        .info-box    { background: rgba(0,217,255,0.1); border: 1px solid #00d9ff; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 14px; line-height: 1.6; }

        code {
            background: rgba(0,0,0,0.3);
            padding: 4px 8px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            word-break: break-all;
            font-size: 13px;
        }
        .copy-btn {
            background: rgba(0,255,136,0.2);
            border: 1px solid #00ff88;
            color: #00ff88;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            margin-left: 8px;
            font-size: 12px;
            transition: all 0.3s ease;
        }
        .copy-btn:hover { background: rgba(0,255,136,0.3); }
        ol { line-height: 1.8; padding-left: 20px; }

        /* ===================== NOTIFICATION TOAST ===================== */
        .notification {
            position: fixed; top: 20px; right: 20px;
            background: rgba(10,14,39,0.95);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 20px 24px;
            max-width: 400px;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            z-index: 2000;
            transform: translateX(500px);
            transition: transform 0.3s ease;
            white-space: pre-line;
        }
        .notification.show { transform: translateX(0); }
        .notification.success { border-left: 4px solid #00ff88; }
        .notification.error   { border-left: 4px solid #ff4757; }
        .notification.info    { border-left: 4px solid #00d9ff; }

        /* ===================== DASHBOARD STYLES ===================== */
        .top-bar {
            background: rgba(20,35,60,0.95);
            backdrop-filter: blur(10px);
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(100,200,255,0.2);
            position: sticky; top: 0; z-index: 100;
        }
        .top-bar-left { display: flex; align-items: center; gap: 12px; }
        .logo-small { font-size: 28px; }
        .brand-name { font-size: 20px; font-weight: 700; color: #00d9ff; }
        .user-info  { display: flex; align-items: center; gap: 12px; }
        .user-name  { font-size: 14px; color: rgba(255,255,255,0.8); }

        .btn-logout {
            padding: 8px 16px;
            background: rgba(255,0,110,0.2);
            border: 1px solid #ff006e;
            border-radius: 8px;
            color: #ff006e;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.3s;
        }
        .btn-logout:hover { background: #ff006e; color: #fff; }

        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #00d9ff;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            margin: 16px 20px;
            transition: color 0.2s;
            font-family: inherit;
        }
        .back-btn:hover { color: #fff; }

        .live-stats {
            background: rgba(0,217,255,0.1);
            border: 1px solid rgba(0,217,255,0.3);
            border-radius: 16px;
            padding: 16px;
            margin: 0 20px 20px;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .live-stats .stat { text-align: center; }
        .live-stats .stat-value { font-size: 20px; font-weight: 700; color: #00d9ff; margin-bottom: 4px; }
        .live-stats .stat-label { font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.5px; }
        .live-indicator-dot {
            display: inline-block;
            width: 8px; height: 8px;
            background: #00ff88;
            border-radius: 50%;
            margin-right: 4px;
            animation: pulse 2s infinite;
        }

        .dash-container { max-width: 480px; margin: 0 auto; padding: 0 20px 20px; }
        .card {
            background: rgba(20,35,60,0.9);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 32px;
            margin-bottom: 24px;
            border: 1px solid rgba(100,200,255,0.1);
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .account-toggle { display: flex; gap: 12px; margin-bottom: 24px; }
        .toggle-btn {
            flex: 1; padding: 12px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            color: rgba(255,255,255,0.6);
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 600; font-size: 14px; font-family: inherit;
        }
        .toggle-btn.active { background: linear-gradient(135deg, #00d9ff, #0099cc); color: #fff; border-color: #00d9ff; }

        .header-text { text-align: center; font-size: 14px; color: #00d9ff; letter-spacing: 4px; font-weight: 600; margin-bottom: 16px; }
        .balance-gradient {
            text-align: center;
            font-size: 48px;
            font-weight: 700;
            background: linear-gradient(135deg, #00d9ff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 32px;
        }

        .section-title { color: #00d9ff; font-size: 18px; font-weight: 600; margin-bottom: 20px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }

        .asset-item {
            display: flex; align-items: center; justify-content: space-between;
            padding: 20px;
            background: rgba(10,25,45,0.6);
            border-radius: 16px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .asset-item:hover { background: rgba(10,25,45,0.8); transform: translateX(5px); }
        .asset-icon {
            width: 48px; height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00d9ff, #a855f7);
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; margin-right: 16px; flex-shrink: 0;
        }
        .asset-info  { flex: 1; }
        .asset-name  { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
        .asset-amount{ font-size: 13px; color: rgba(255,255,255,0.6); }
        .asset-value { text-align: right; }
        .asset-price { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .asset-change{ font-size: 13px; padding: 4px 8px; border-radius: 6px; }
        .positive { color: #00ff88; background: rgba(0,255,136,0.1); }
        .negative { color: #ff006e; background: rgba(255,0,110,0.1); }

        /* Bot cards */
        .bot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .bot-card {
            background: rgba(10,25,45,0.6);
            border: 1px solid rgba(100,200,255,0.2);
            border-radius: 16px;
            padding: 20px; cursor: pointer;
            transition: all 0.3s; text-align: center;
        }
        .bot-card:hover { border-color: #00d9ff; background: rgba(0,217,255,0.08); transform: translateY(-2px); }
        .bot-card.selected { border-color: #00ff88; background: rgba(0,255,136,0.1); }
        .bot-icon   { font-size: 32px; margin-bottom: 8px; }
        .bot-name   { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .bot-return { font-size: 12px; color: #00ff88; }
        .bot-risk   { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px; }

        /* ===================== RESPONSIVE ===================== */
        @media (max-width: 768px) {
            .balance-amount { font-size: 36px; }
            .stats-grid { grid-template-columns: 1fr; }
            .payment-methods { grid-template-columns: repeat(2,1fr); }
        }
    </style>
</head>
<body>

<!-- =========================================================
     PAGE 1 : HOME
     ========================================================= -->
<div id="homePage" class="page active">
    <div class="container">
        <div class="header">
            <h1>🌍 CryptoPro Africa</h1>
            <p>All African Payment Methods – Real Money Trading</p>
            <div class="live-indicator">
                <div class="live-dot"></div>
                <span>All Payments REAL • Trading Simulated</span>
            </div>
        </div>

        <div class="balance-card">
            <div class="balance-label">Total Balance</div>
            <div class="balance-amount" id="balanceDisplay">$0.00</div>
            <div class="balance-label">Available for Trading &amp; Withdrawal</div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value" id="totalDeposited">$0.00</div>
                <div class="stat-label">💰 Deposited (REAL)</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="totalProfit">$0.00</div>
                <div class="stat-label">📈 Profit (Simulated)</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="todayProfit">$0.00</div>
                <div class="stat-label">⚡ Today (Simulated)</div>
            </div>
        </div>

        <div class="action-buttons">
            <button class="btn btn-primary"   onclick="openDepositModal()">💰 Deposit (REAL MONEY)</button>
            <button class="btn btn-primary"   onclick="openWithdrawModal()">💸 Withdraw (REAL MONEY)</button>
            <button class="btn btn-secondary" onclick="simulateTrade()">📊 Auto Trade (Sim)</button>
            <button class="btn btn-dashboard" onclick="showPage('dashboard')">📊 Go to Dashboard</button>
        </div>
    </div>
</div>

<!-- =========================================================
     PAGE 2 : DASHBOARD
     ========================================================= -->
<div id="dashboardPage" class="page">
    <div class="top-bar">
        <div class="top-bar-left">
            <div class="logo-small">💎</div>
            <div class="brand-name">CryptoPro</div>
        </div>
        <div class="user-info">
            <div class="user-name" id="userName">Loading...</div>
            <button class="btn-logout" onclick="logout()">Logout</button>
        </div>
    </div>

    <button class="back-btn" onclick="showPage('home')">← Back to Home</button>

    <div class="live-stats">
        <div class="stat">
            <div class="stat-value" id="activeUsers">1,247</div>
            <div class="stat-label">Active Users</div>
        </div>
        <div class="stat">
            <div class="stat-value" id="volume24h">$97.5M</div>
            <div class="stat-label">24H Volume</div>
        </div>
        <div class="stat">
            <div class="stat-label"><span class="live-indicator-dot"></span>Status</div>
            <div class="stat-value" style="color:#00ff88;">LIVE</div>
        </div>
    </div>

    <div class="dash-container">
        <div class="card">
            <div class="account-toggle">
                <button class="toggle-btn active" id="demoBtn" onclick="switchAccount('demo')">🎮 DEMO</button>
                <button class="toggle-btn"        id="realBtn" onclick="switchAccount('real')">💰 REAL</button>
            </div>
            <div class="header-text">TOTAL PORTFOLIO VALUE</div>
            <div class="balance-gradient" id="totalBalance">$0.00</div>

            <button class="btn btn-trade"    onclick="openTradeModal()">⚡ TRADE NOW</button>
            <button class="btn btn-bot"      onclick="openBotModal()">🤖 SELECT TRADING BOT</button>
            <button class="btn btn-deposit"  onclick="showPage('home')">💰 DEPOSIT</button>
            <button class="btn btn-withdraw" onclick="openDashWithdrawModal()">💸 WITHDRAW</button>
        </div>

        <div class="card">
            <div class="section-title">📊 LIVE PRICES</div>

            <div class="asset-item" onclick="openTradeModal('BTC/USDT')">
                <div class="asset-icon">₿</div>
                <div class="asset-info"><div class="asset-name">BTC/USDT</div><div class="asset-amount">Bitcoin</div></div>
                <div class="asset-value"><div class="asset-price" id="btcPrice">$64,256.76</div><div class="asset-change positive" id="btcChange">+2.45%</div></div>
            </div>

            <div class="asset-item" onclick="openTradeModal('ETH/USDT')">
                <div class="asset-icon">Ξ</div>
                <div class="asset-info"><div class="asset-name">ETH/USDT</div><div class="asset-amount">Ethereum</div></div>
                <div class="asset-value"><div class="asset-price" id="ethPrice">$3,425.83</div><div class="asset-change negative" id="ethChange">-1.23%</div></div>
            </div>

            <div class="asset-item" onclick="openTradeModal('SOL/USDT')">
                <div class="asset-icon">◎</div>
                <div class="asset-info"><div class="asset-name">SOL/USDT</div><div class="asset-amount">Solana</div></div>
                <div class="asset-value"><div class="asset-price" id="solPrice">$98.81</div><div class="asset-change positive" id="solChange">+3.12%</div></div>
            </div>
        </div>
    </div>
</div>

<!-- =========================================================
     MODALS  (shared by both pages)
     ========================================================= -->

<!-- Deposit -->
<div id="depositModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>💰 Deposit Funds</h2>
            <button class="close-btn" onclick="closeModal('depositModal')">×</button>
        </div>
        <div class="warning-box"><strong>⚠️ REAL PAYMENT:</strong> All payments are REAL and will deduct actual money!</div>

        <div class="form-group">
            <label>Amount (USD)</label>
            <input type="number" id="depositAmount" placeholder="Minimum $10" min="10" step="0.01">
        </div>

        <div class="form-group">
            <label>Select Payment Method</label>
            <div class="payment-methods">
                <div class="payment-method" onclick="selectPayment(event,'mpesa','Kenya')"><div class="payment-method-icon">🇰🇪</div><div class="payment-method-name">M-Pesa</div></div>
                <div class="payment-method" onclick="selectPayment(event,'airtel-ke','Kenya')"><div class="payment-method-icon">🇰🇪</div><div class="payment-method-name">Airtel KE</div></div>
                <div class="payment-method" onclick="selectPayment(event,'mtn-ng','Nigeria')"><div class="payment-method-icon">🇳🇬</div><div class="payment-method-name">MTN NG</div></div>
                <div class="payment-method" onclick="selectPayment(event,'bank-ng','Nigeria')"><div class="payment-method-icon">🇳🇬</div><div class="payment-method-name">Bank NG</div></div>
                <div class="payment-method" onclick="selectPayment(event,'mtn-gh','Ghana')"><div class="payment-method-icon">🇬🇭</div><div class="payment-method-name">MTN GH</div></div>
                <div class="payment-method" onclick="selectPayment(event,'vodafone-gh','Ghana')"><div class="payment-method-icon">🇬🇭</div><div class="payment-method-name">Vodafone</div></div>
                <div class="payment-method" onclick="selectPayment(event,'mtn-ug','Uganda')"><div class="payment-method-icon">🇺🇬</div><div class="payment-method-name">MTN UG</div></div>
                <div class="payment-method" onclick="selectPayment(event,'airtel-ug','Uganda')"><div class="payment-method-icon">🇺🇬</div><div class="payment-method-name">Airtel UG</div></div>
                <div class="payment-method" onclick="selectPayment(event,'mpesa-tz','Tanzania')"><div class="payment-method-icon">🇹🇿</div><div class="payment-method-name">M-Pesa TZ</div></div>
                <div class="payment-method" onclick="selectPayment(event,'tigo-tz','Tanzania')"><div class="payment-method-icon">🇹🇿</div><div class="payment-method-name">Tigo Pesa</div></div>
                <div class="payment-method" onclick="selectPayment(event,'bank-za','South Africa')"><div class="payment-method-icon">🇿🇦</div><div class="payment-method-name">Bank ZA</div></div>
                <div class="payment-method" onclick="selectPayment(event,'mtn-rw','Rwanda')"><div class="payment-method-icon">🇷🇼</div><div class="payment-method-name">MTN RW</div></div>
                <div class="payment-method" onclick="selectPayment(event,'usdt','Global')"><div class="payment-method-icon">💎</div><div class="payment-method-name">USDT</div></div>
                <div class="payment-method" onclick="selectPayment(event,'bitcoin','Global')"><div class="payment-method-icon">₿</div><div class="payment-method-name">Bitcoin</div></div>
            </div>
        </div>
        <button class="btn btn-primary" onclick="processDeposit()">Continue to Payment →</button>
    </div>
</div>

<!-- Withdraw (Home) -->
<div id="withdrawModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>💸 Withdraw Funds</h2>
            <button class="close-btn" onclick="closeModal('withdrawModal')">×</button>
        </div>
        <div class="info-box"><strong>📋 Real Withdrawal:</strong><br>Processed within 1–24 hours to your account.</div>

        <div class="form-group"><label>Amount (USD)</label><input type="number" id="withdrawAmount" placeholder="Minimum $20" min="20" step="0.01"></div>
        <div class="form-group">
            <label>Withdrawal Method</label>
            <select id="withdrawMethod">
                <optgroup label="🇰🇪 Kenya"><option value="mpesa">M-Pesa Kenya</option><option value="airtel-ke">Airtel Money Kenya</option></optgroup>
                <optgroup label="🇳🇬 Nigeria"><option value="mtn-ng">MTN Mobile Money</option><option value="bank-ng">Nigerian Bank</option></optgroup>
                <optgroup label="🇬🇭 Ghana"><option value="mtn-gh">MTN Mobile Money</option><option value="vodafone-gh">Vodafone Cash</option></optgroup>
                <optgroup label="🇺🇬 Uganda"><option value="mtn-ug">MTN Mobile Money</option><option value="airtel-ug">Airtel Money</option></optgroup>
                <optgroup label="🇹🇿 Tanzania"><option value="mpesa-tz">M-Pesa Tanzania</option><option value="tigo-tz">Tigo Pesa</option></optgroup>
                <optgroup label="🇿🇦 South Africa"><option value="bank-za">South African Bank</option></optgroup>
                <optgroup label="🇷🇼 Rwanda"><option value="mtn-rw">MTN Mobile Money</option></optgroup>
                <optgroup label="💎 Crypto"><option value="usdt">USDT (TRC20)</option><option value="bitcoin">Bitcoin</option></optgroup>
            </select>
        </div>
        <div class="form-group"><label>Account Details</label><input type="text" id="withdrawAccount" placeholder="Phone number, Bank account, or Crypto address"></div>
        <div class="form-group"><label>Additional Info (Optional)</label><textarea id="withdrawNotes" rows="2" placeholder="Bank name, account name, etc..."></textarea></div>
        <button class="btn btn-primary" onclick="submitWithdrawal()">Submit Withdrawal Request</button>
    </div>
</div>

<!-- Trade -->
<div id="tradeModal" class="modal">
    <div class="modal-content">
        <div class="modal-header"><h2>⚡ Place Trade</h2><button class="close-btn" onclick="closeModal('tradeModal')">×</button></div>
        <div class="info-box"><strong>📊 Trading is SIMULATED.</strong> Profits and losses affect your simulated balance only.</div>
        <div class="form-group"><label>Trading Pair</label>
            <select id="tradePair">
                <option value="BTC/USDT">BTC/USDT – Bitcoin</option>
                <option value="ETH/USDT">ETH/USDT – Ethereum</option>
                <option value="SOL/USDT">SOL/USDT – Solana</option>
            </select>
        </div>
        <div class="form-group"><label>Direction</label>
            <select id="tradeDirection"><option value="long">📈 LONG (Price goes Up)</option><option value="short">📉 SHORT (Price goes Down)</option></select>
        </div>
        <div class="form-group"><label>Amount (USD)</label><input type="number" id="tradeAmount" placeholder="e.g. 50" min="1" step="0.01"></div>
        <div class="form-group"><label>Leverage</label>
            <select id="tradeLeverage"><option value="1">1x</option><option value="5">5x</option><option value="10" selected>10x</option><option value="50">50x</option><option value="100">100x</option></select>
        </div>
        <button class="btn btn-trade" onclick="executeTrade()">⚡ EXECUTE TRADE</button>
    </div>
</div>

<!-- Bot -->
<div id="botModal" class="modal">
    <div class="modal-content">
        <div class="modal-header"><h2>🤖 Trading Bots</h2><button class="close-btn" onclick="closeModal('botModal')">×</button></div>
        <div class="info-box">Bots run simulated auto-trades on your balance. Select one and set a budget.</div>
        <div class="bot-grid">
            <div class="bot-card" onclick="selectBot(this,'conservative')"><div class="bot-icon">🐢</div><div class="bot-name">Conservative</div><div class="bot-return">+2–5% / day</div><div class="bot-risk">Low Risk</div></div>
            <div class="bot-card" onclick="selectBot(this,'moderate')"><div class="bot-icon">⚖️</div><div class="bot-name">Moderate</div><div class="bot-return">+5–12% / day</div><div class="bot-risk">Medium Risk</div></div>
            <div class="bot-card" onclick="selectBot(this,'aggressive')"><div class="bot-icon">🦅</div><div class="bot-name">Aggressive</div><div class="bot-return">+10–25% / day</div><div class="bot-risk">High Risk</div></div>
            <div class="bot-card" onclick="selectBot(this,'ai')"><div class="bot-icon">🧠</div><div class="bot-name">AI Smart</div><div class="bot-return">+8–18% / day</div><div class="bot-risk">Adaptive Risk</div></div>
        </div>
        <div class="form-group" style="margin-top:20px;"><label>Bot Budget (USD)</label><input type="number" id="botBudget" placeholder="e.g. 100" min="10" step="0.01"></div>
        <button class="btn btn-bot" onclick="startBot()">🤖 START BOT</button>
    </div>
</div>

<!-- Dashboard Withdraw (simple redirect to home withdraw) -->
<div id="dashWithdrawModal" class="modal">
    <div class="modal-content">
        <div class="modal-header"><h2>💸 Withdraw Funds</h2><button class="close-btn" onclick="closeModal('dashWithdrawModal')">×</button></div>
        <div class="warning-box"><strong>⚠️ Note:</strong> Use the full withdrawal form on the Home page for all payment methods.</div>
        <button class="btn btn-primary" onclick="closeModal('dashWithdrawModal'); showPage('home'); setTimeout(function(){ openWithdrawModal(); }, 300);">Go to Withdrawal Form →</button>
    </div>
</div>

<!-- =========================================================
     SCRIPT
     ========================================================= -->
<script>
// ===================== CONFIG =====================
var CONFIG = {
    ADMIN_TELEGRAM: '@YourTelegram',
    ADMIN_WHATSAPP: '+254700000000',
    ADMIN_EMAIL:    'payments@cryptopro.com',
    PAYMENT_DETAILS: {
        mpesa:    { paybill: '700474', account: 'CRYPTOPRO' },
        usdt:     { address: 'TK4rUz6TUEd7zCWeuiX5R47pSNdPswJnAc', network: 'TRC20' },
        bitcoin:  { address: 'YOUR_BITCOIN_ADDRESS' },
        'bank-ng':{ bank: 'GTBank',        account: '0123456789', name: 'CryptoPro Ltd' },
        'bank-za':{ bank: 'Standard Bank', account: '123456789',  name: 'CryptoPro' }
    },
    EXCHANGE_RATES: { KES: 130, NGN: 750, GHS: 12, UGX: 3700, TZS: 2500, ZAR: 18 },
    MIN_DEPOSIT:  10,
    MIN_WITHDRAW: 20
};

// ===================== STATE =====================
var currentUser = {
    phone: '', email: '',
    balance: 0, demoBalance: 1000,
    totalDeposited: 0, totalProfit: 0, todayProfit: 0,
    transactions: [],
    lastLoginDate: new Date().toDateString(),
    activeBots: []
};

var selectedPaymentMethod = null;
var selectedCountry       = null;
var selectedBotType        = null;
var activeAccount          = 'demo';   // 'demo' | 'real'

var prices = {
    'BTC/USDT': { price: 64256.76, change: 2.45  },
    'ETH/USDT': { price: 3425.83,  change: -1.23 },
    'SOL/USDT': { price: 98.81,    change: 3.12  }
};

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', function () {
    loadUserData();
    updateHomeDisplays();
    updateDashDisplays();
    startAutoTrading();
    startPriceSimulation();
    startBotSimulation();
    simulateLiveStats();
});

// ===================== PAGE SWITCHING =====================
function showPage(name) {
    document.getElementById('homePage').classList.remove('active');
    document.getElementById('dashboardPage').classList.remove('active');
    if (name === 'dashboard') {
        document.getElementById('dashboardPage').classList.add('active');
        updateDashDisplays();
    } else {
        document.getElementById('homePage').classList.add('active');
        updateHomeDisplays();
    }
    window.scrollTo(0, 0);
}

// ===================== LOAD / SAVE =====================
function loadUserData() {
    var saved = localStorage.getItem('cryptoproUserAfrica');
    if (saved) {
        currentUser = JSON.parse(saved);
        if (currentUser.demoBalance === undefined) currentUser.demoBalance = 1000;
        if (!currentUser.activeBots)               currentUser.activeBots  = [];
        if (currentUser.lastLoginDate !== new Date().toDateString()) {
            currentUser.todayProfit   = 0;
            currentUser.lastLoginDate = new Date().toDateString();
        }
    } else {
        var phone = prompt('👋 Welcome to CryptoPro Africa!\n\nEnter your phone number:');
        var email = prompt('Enter your email (optional):');
        if (phone) { currentUser.phone = phone; currentUser.email = email || ''; }
        saveUserData();
    }
    document.getElementById('userName').textContent = currentUser.phone || 'User';
}

function saveUserData() {
    localStorage.setItem('cryptoproUserAfrica', JSON.stringify(currentUser));
}

// ===================== BALANCE HELPERS =====================
function getActiveBalance() { return activeAccount === 'demo' ? currentUser.demoBalance : currentUser.balance; }
function setActiveBalance(v) {
    if (activeAccount === 'demo') currentUser.demoBalance = v;
    else                           currentUser.balance     = v;
}

// ===================== UPDATE DISPLAYS =====================
function updateHomeDisplays() {
    document.getElementById('balanceDisplay').textContent  = '$' + currentUser.balance.toFixed(2);
    document.getElementById('totalDeposited').textContent  = '$' + currentUser.totalDeposited.toFixed(2);
    document.getElementById('totalProfit').textContent     = '$' + currentUser.totalProfit.toFixed(2);
    document.getElementById('todayProfit').textContent     = '$' + currentUser.todayProfit.toFixed(2);
}

function updateDashDisplays() {
    document.getElementById('totalBalance').textContent = '$' + getActiveBalance().toFixed(2);
    document.getElementById('userName').textContent     = currentUser.phone || 'User';
    updatePriceDisplays();
}

function updatePriceDisplays() {
    var fmt = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    document.getElementById('btcPrice').textContent = '$' + prices['BTC/USDT'].price.toLocaleString('en-US', fmt);
    document.getElementById('ethPrice').textContent = '$' + prices['ETH/USDT'].price.toLocaleString('en-US', fmt);
    document.getElementById('solPrice').textContent = '$' + prices['SOL/USDT'].price.toLocaleString('en-US', fmt);
    setChangeLabel('btcChange', prices['BTC/USDT'].change);
    setChangeLabel('ethChange', prices['ETH/USDT'].change);
    setChangeLabel('solChange', prices['SOL/USDT'].change);
}

function setChangeLabel(id, val) {
    var el   = document.getElementById(id);
    var sign = val >= 0 ? '+' : '';
    el.textContent = sign + val.toFixed(2) + '%';
    el.className   = 'asset-change ' + (val >= 0 ? 'positive' : 'negative');
}

// ===================== AUTO-TRADING (home page sim) =====================
function startAutoTrading() {
    setInterval(function () {
        if (currentUser.balance > 0 && Math.random() > 0.4) {
            var profit = parseFloat((Math.random() * 3 + 1).toFixed(2));
            currentUser.balance     += profit;
            currentUser.totalProfit += profit;
            currentUser.todayProfit += profit;
            saveUserData();
            updateHomeDisplays();
        }
    }, 45000);
}

function simulateTrade() {
    if (currentUser.balance < 10) {
        showNotification('❌ Minimum $10 balance needed\n\nDeposit to start auto-trading!', 'error');
        return;
    }
    var p = parseFloat((Math.random() * 15 + 5).toFixed(2));
    currentUser.balance     += p;
    currentUser.totalProfit += p;
    currentUser.todayProfit += p;
    addTransaction({ type: 'trade', amount: p, status: 'completed' });
    saveUserData();
    updateHomeDisplays();
    showNotification('🎉 Trade Completed!\n\n💰 Profit: $' + p.toFixed(2) + '\n📊 Balance: $' + currentUser.balance.toFixed(2), 'success');
}

// ===================== PRICE SIMULATION =====================
function startPriceSimulation() {
    setInterval(function () {
        Object.keys(prices).forEach(function (pair) {
            prices[pair].price += (Math.random() - 0.48) * prices[pair].price * 0.004;
            prices[pair].price  = Math.max(1, prices[pair].price);
            prices[pair].change += (Math.random() - 0.5) * 0.3;
            prices[pair].change = Math.max(-15, Math.min(15, prices[pair].change));
        });
        updatePriceDisplays();
    }, 2000);
}

// ===================== LIVE STATS SIM =====================
function simulateLiveStats() {
    setInterval(function () {
        document.getElementById('activeUsers').textContent = (1200 + Math.floor(Math.random() * 200)).toLocaleString();
        document.getElementById('volume24h').textContent   = '$' + (90 + Math.random() * 20).toFixed(1) + 'M';
    }, 5000);
}

// ===================== ACCOUNT TOGGLE (dashboard) =====================
function switchAccount(type) {
    activeAccount = type;
    document.getElementById('demoBtn').className = 'toggle-btn' + (type === 'demo' ? ' active' : '');
    document.getElementById('realBtn').className = 'toggle-btn' + (type === 'real' ? ' active' : '');
    updateDashDisplays();
}

// ===================== MODAL OPEN / CLOSE =====================
function openDepositModal()  { document.getElementById('depositModal').classList.add('active'); }
function openWithdrawModal() {
    if (currentUser.balance < CONFIG.MIN_WITHDRAW) {
        showNotification('❌ Minimum withdrawal: $' + CONFIG.MIN_WITHDRAW + '\n\nYour balance: $' + currentUser.balance.toFixed(2), 'error');
        return;
    }
    document.getElementById('withdrawModal').classList.add('active');
}
function openTradeModal(pair) {
    if (pair) document.getElementById('tradePair').value = pair;
    document.getElementById('tradeModal').classList.add('active');
}
function openBotModal()            { document.getElementById('botModal').classList.add('active'); }
function openDashWithdrawModal()   { document.getElementById('dashWithdrawModal').classList.add('active'); }

function closeModal(id) {
    var m = document.getElementById(id);
    if (m) m.classList.remove('active');
}

// ===================== PAYMENT METHOD SELECTION =====================
function selectPayment(evt, method, country) {
    selectedPaymentMethod = method;
    selectedCountry       = country;
    document.querySelectorAll('.payment-method').forEach(function (el) { el.classList.remove('selected'); });
    evt.target.closest('.payment-method').classList.add('selected');
}

// ===================== DEPOSIT FLOW =====================
function processDeposit() {
    var amount = parseFloat(document.getElementById('depositAmount').value);
    if (!amount || amount < CONFIG.MIN_DEPOSIT) { showNotification('❌ Minimum deposit: $' + CONFIG.MIN_DEPOSIT, 'error'); return; }
    if (!selectedPaymentMethod)                 { showNotification('❌ Please select a payment method', 'error'); return; }
    closeModal('depositModal');
    showPaymentInstructions(selectedPaymentMethod, amount, selectedCountry);
}

function showPaymentInstructions(method, amount, country) {
    var local = amount, currency = 'USD';
    if (method === 'mpesa' || method === 'airtel-ke')  { local = Math.ceil(amount * CONFIG.EXCHANGE_RATES.KES); currency = 'KES'; }
    else if (method.indexOf('-ng') > -1)               { local = Math.ceil(amount * CONFIG.EXCHANGE_RATES.NGN); currency = 'NGN'; }
    else if (method.indexOf('-gh') > -1)               { local = Math.ceil(amount * CONFIG.EXCHANGE_RATES.GHS); currency = 'GHS'; }
    else if (method.indexOf('-ug') > -1)               { local = Math.ceil(amount * CONFIG.EXCHANGE_RATES.UGX); currency = 'UGX'; }
    else if (method.indexOf('-tz') > -1)               { local = Math.ceil(amount * CONFIG.EXCHANGE_RATES.TZS); currency = 'TZS'; }
    else if (method.indexOf('-za') > -1)               { local = Math.ceil(amount * CONFIG.EXCHANGE_RATES.ZAR); currency = 'ZAR'; }

    var html = '';
    if (method === 'mpesa')                  html = tplMpesa(amount, local);
    else if (method === 'usdt')              html = tplUSDT(amount);
    else if (method === 'bitcoin')           html = tplBitcoin(amount);
    else if (method.indexOf('mtn-') === 0)   html = tplMTN(amount, local, currency, country);
    else if (method.indexOf('airtel-') === 0)html = tplAirtel(amount, local, currency, country);
    else if (method.indexOf('bank-') === 0)  html = tplBank(amount, local, currency, country, method);
    else                                     html = tplGeneric(method, amount, local, currency, country);

    createDynamicModal('paymentInstructions', html);
}

// ---------- payment instruction templates ----------
function tplMpesa(usd, kes) {
    return '<div class="modal-header"><h2>📱 M-Pesa Payment</h2><button class="close-btn" onclick="closeModal(\'paymentInstructions\')">×</button></div>' +
    '<div class="success-box"><strong>💰 Amount to Pay:</strong><br><span style="font-size:24px;">KES ' + kes.toLocaleString() + '</span><br><small>= $' + usd.toFixed(2) + ' USD</small></div>' +
    '<div class="info-box"><strong>📋 Payment Steps:</strong><ol>' +
    '<li>Go to M-Pesa menu on your phone</li>' +
    '<li>Select <strong>Lipa na M-Pesa</strong></li>' +
    '<li>Select <strong>Pay Bill</strong></li>' +
    '<li>Business Number: <code>' + CONFIG.PAYMENT_DETAILS.mpesa.paybill + '</code><button class="copy-btn" onclick="copyText(\'' + CONFIG.PAYMENT_DETAILS.mpesa.paybill + '\')">Copy</button></li>' +
    '<li>Account Number: <code>' + currentUser.phone + '</code><button class="copy-btn" onclick="copyText(\'' + currentUser.phone + '\')">Copy</button></li>' +
    '<li>Amount: <code>' + kes + '</code></li>' +
    '<li>Enter your M-Pesa PIN</li><li>Wait for confirmation SMS</li></ol></div>' +
    '<div class="warning-box"><strong>⚠️ IMPORTANT:</strong><br>• Send EXACTLY KES ' + kes.toLocaleString() + '<br>• Use account number: ' + currentUser.phone + '<br>• Keep your M-Pesa confirmation code</div>' +
    '<button class="btn btn-primary" style="margin:12px 0;" onclick="confirmPayment(\'mpesa\',' + usd + ')">✅ I\'ve Completed Payment</button>' +
    '<button class="btn btn-secondary" onclick="contactSupport(\'mpesa\',' + usd + ')">💬 Contact Support</button>';
}

function tplUSDT(usd) {
    return '<div class="modal-header"><h2>💎 USDT Payment (TRC20)</h2><button class="close-btn" onclick="closeModal(\'paymentInstructions\')">×</button></div>' +
    '<div class="success-box"><strong>💰 Amount to Send:</strong><br><span style="font-size:28px;color:#00ff88;">' + usd.toFixed(2) + ' USDT</span></div>' +
    '<div class="info-box"><strong>📋 Send USDT To:</strong><br><br><strong>🔗 Network:</strong><br><code>TRC20 (Tron)</code><br><br><strong>📬 Address:</strong><br>' +
    '<code style="display:block;margin:8px 0;padding:12px;background:rgba(0,0,0,0.3);border-radius:8px;">' + CONFIG.PAYMENT_DETAILS.usdt.address + '</code>' +
    '<button class="copy-btn" onclick="copyText(\'' + CONFIG.PAYMENT_DETAILS.usdt.address + '\')">📋 Copy Address</button></div>' +
    '<div class="warning-box"><strong>⚠️ CRITICAL:</strong><br>• Use TRC20 network ONLY<br>• Send exactly ' + usd.toFixed(2) + ' USDT<br>• Wrong network = LOST FUNDS<br>• Wait 1-2 minutes for confirmation</div>' +
    '<div class="form-group"><label>Transaction Hash (TxID)</label><input type="text" id="txHash" placeholder="Paste after sending"></div>' +
    '<button class="btn btn-primary" onclick="confirmCryptoPayment(\'usdt\',' + usd + ')">✅ I\'ve Sent – Verify</button>';
}

function tplBitcoin(usd) {
    var btc = (usd / 45000).toFixed(8);
    return '<div class="modal-header"><h2>₿ Bitcoin Payment</h2><button class="close-btn" onclick="closeModal(\'paymentInstructions\')">×</button></div>' +
    '<div class="success-box"><strong>💰 Approximate Amount:</strong><br><span style="font-size:24px;color:#f7931a;">' + btc + ' BTC</span><br><small>≈ $' + usd.toFixed(2) + ' USD</small></div>' +
    '<div class="info-box"><strong>📬 Bitcoin Address:</strong><br><code style="display:block;margin:8px 0;padding:12px;background:rgba(0,0,0,0.3);border-radius:8px;">' + CONFIG.PAYMENT_DETAILS.bitcoin.address + '</code>' +
    '<button class="copy-btn" onclick="copyText(\'' + CONFIG.PAYMENT_DETAILS.bitcoin.address + '\')">📋 Copy Address</button></div>' +
    '<div class="warning-box"><strong>⚠️ NOTE:</strong><br>• Bitcoin price fluctuates<br>• Wait for 1 confirmation<br>• Network fee applies<br>• Processing: 10-60 minutes</div>' +
    '<div class="form-group"><label>Transaction ID</label><input type="text" id="btcTxId" placeholder="Paste after sending"></div>' +
    '<button class="btn btn-primary" onclick="confirmCryptoPayment(\'bitcoin\',' + usd + ')">✅ I\'ve Sent – Verify</button>';
}

function tplMTN(usd, local, currency, country) {
    return '<div class="modal-header"><h2>📱 MTN Mobile Money – ' + country + '</h2><button class="close-btn" onclick="closeModal(\'paymentInstructions\')">×</button></div>' +
    '<div class="success-box"><strong>💰 Amount to Pay:</strong><br><span style="font-size:24px;">' + currency + ' ' + local.toLocaleString() + '</span><br><small>= $' + usd.toFixed(2) + ' USD</small></div>' +
    '<div class="info-box"><strong>📋 Payment Instructions:</strong><ol>' +
    '<li>Dial <code>*170#</code> on your MTN line</li><li>Select <strong>Send Money</strong></li><li>Select <strong>To Non-MTN Number</strong></li>' +
    '<li>Enter: <code>' + CONFIG.ADMIN_WHATSAPP + '</code></li><li>Amount: <code>' + local + '</code></li>' +
    '<li>Reference: <code>' + currentUser.phone + '</code></li><li>Confirm with PIN</li></ol></div>' +
    '<div class="warning-box"><strong>⚠️ IMPORTANT:</strong><br>• Use reference: ' + currentUser.phone + '<br>• Send exactly ' + currency + ' ' + local.toLocaleString() + '<br>• Keep confirmation SMS</div>' +
    '<button class="btn btn-primary" onclick="confirmPayment(\'mtn\',' + usd + ')">✅ Payment Completed</button>';
}

function tplAirtel(usd, local, currency, country) {
    return '<div class="modal-header"><h2>📱 Airtel Money – ' + country + '</h2><button class="close-btn" onclick="closeModal(\'paymentInstructions\')">×</button></div>' +
    '<div class="success-box"><strong>💰 Amount to Pay:</strong><br><span style="font-size:24px;">' + currency + ' ' + local.toLocaleString() + '</span><br><small>= $' + usd.toFixed(2) + ' USD</small></div>' +
    '<div class="info-box"><strong>📋 Payment Steps:</strong><ol>' +
    '<li>Dial <code>*150*60#</code></li><li>Select <strong>Send Money</strong></li>' +
    '<li>Enter: <code>' + CONFIG.ADMIN_WHATSAPP + '</code></li><li>Amount: <code>' + local + '</code></li>' +
    '<li>Reference: <code>' + currentUser.phone + '</code></li><li>Confirm with PIN</li></ol></div>' +
    '<button class="btn btn-primary" onclick="confirmPayment(\'airtel\',' + usd + ')">✅ Payment Done</button>';
}

function tplBank(usd, local, currency, country, method) {
    var bd = CONFIG.PAYMENT_DETAILS[method] || { bank:'Contact Support', account:'N/A', name:'N/A' };
    return '<div class="modal-header"><h2>🏦 Bank Transfer – ' + country + '</h2><button class="close-btn" onclick="closeModal(\'paymentInstructions\')">×</button></div>' +
    '<div class="success-box"><strong>💰 Amount to Pay:</strong><br><span style="font-size:24px;">' + currency + ' ' + local.toLocaleString() + '</span><br><small>= $' + usd.toFixed(2) + ' USD</small></div>' +
    '<div class="info-box"><strong>🏦 Bank Details:</strong><br><br><strong>Bank:</strong> ' + bd.bank + '<br>' +
    '<strong>Account Number:</strong> <code>' + bd.account + '</code><button class="copy-btn" onclick="copyText(\'' + bd.account + '\')">Copy</button><br>' +
    '<strong>Account Name:</strong> ' + bd.name + '<br><strong>Reference:</strong> <code>' + currentUser.phone + '</code></div>' +
    '<div class="form-group"><label>Transaction Reference</label><input type="text" id="bankRef" placeholder="Enter bank reference number"></div>' +
    '<button class="btn btn-primary" onclick="confirmBankPayment(\'' + method + '\',' + usd + ')">✅ I\'ve Transferred</button>';
}

function tplGeneric(method, usd, local, currency, country) {
    return '<div class="modal-header"><h2>💰 Payment – ' + method.toUpperCase() + '</h2><button class="close-btn" onclick="closeModal(\'paymentInstructions\')">×</button></div>' +
    '<div class="success-box"><strong>💰 Amount:</strong><br><span style="font-size:24px;">' + currency + ' ' + local.toLocaleString() + '</span><br><small>= $' + usd.toFixed(2) + ' USD</small></div>' +
    '<div class="info-box"><strong>📞 Contact Support:</strong><br><br>WhatsApp: ' + CONFIG.ADMIN_WHATSAPP + '<br>Telegram: ' + CONFIG.ADMIN_TELEGRAM + '<br>Email: ' + CONFIG.ADMIN_EMAIL +
    '<br><br><strong>Include:</strong><br>• Amount: $' + usd.toFixed(2) + '<br>• Method: ' + method + '<br>• Your phone: ' + currentUser.phone + '</div>' +
    '<button class="btn btn-primary" onclick="contactSupport(\'' + method + '\',' + usd + ')">💬 Contact Support</button>';
}

// ===================== PAYMENT CONFIRMATION =====================
function confirmPayment(method, amount) {
    var ref = prompt('Enter confirmation code/reference:');
    if (!ref) { showNotification('❌ Reference required', 'error'); return; }
    notifyAdmin('🆕 NEW DEPOSIT\n\n💰 Amount: $' + amount.toFixed(2) + '\n📱 Method: ' + method.toUpperCase() + '\n👤 User: ' + currentUser.phone + '\n🔢 Reference: ' + ref + '\n⏰ Time: ' + new Date().toLocaleString() + '\n\n✅ Please verify and approve.');
    addTransaction({ type:'deposit', amount:amount, method:method, status:'pending', reference:ref });
    closeModal('paymentInstructions');
    showNotification('✅ Payment Submitted!\n\n💰 Amount: $' + amount.toFixed(2) + '\n🔢 Reference: ' + ref + '\n\n⏱️ Verification: 5-30 mins\nYou\'ll be notified once approved!', 'success', 10000);
}

function confirmCryptoPayment(type, amount) {
    var inputId = type === 'bitcoin' ? 'btcTxId' : 'txHash';
    var txHash  = document.getElementById(inputId).value.trim();
    if (!txHash || txHash.length < 40) { showNotification('❌ Invalid transaction hash', 'error'); return; }
    notifyAdmin('🆕 NEW CRYPTO DEPOSIT\n\n💎 Amount: $' + amount.toFixed(2) + '\n₿ Type: ' + type.toUpperCase() + '\n👤 User: ' + currentUser.phone + '\n🔗 TxHash: ' + txHash + '\n⏰ Time: ' + new Date().toLocaleString() + '\n\n✅ Please verify on blockchain.');
    addTransaction({ type:'deposit', amount:amount, method:type, status:'pending', reference:txHash });
    closeModal('paymentInstructions');
    showNotification('✅ Transaction Submitted!\n\n💎 ' + type.toUpperCase() + ': $' + amount.toFixed(2) + '\n🔗 TxHash: ' + txHash.slice(0,16) + '...\n\n⏱️ Verifying on blockchain...\nUsually 1-10 minutes.', 'success', 10000);
}

function confirmBankPayment(method, amount) {
    var bankRef = document.getElementById('bankRef').value.trim();
    if (!bankRef) { showNotification('❌ Bank reference required', 'error'); return; }
    notifyAdmin('🆕 NEW BANK DEPOSIT\n\n💰 Amount: $' + amount.toFixed(2) + '\n🏦 Method: ' + method.toUpperCase() + '\n👤 User: ' + currentUser.phone + '\n🔢 Bank Ref: ' + bankRef + '\n⏰ Time: ' + new Date().toLocaleString() + '\n\n✅ Please verify with bank.');
    addTransaction({ type:'deposit', amount:amount, method:method, status:'pending', reference:bankRef });
    closeModal('paymentInstructions');
    showNotification('✅ Bank Transfer Submitted!\n\n💰 Amount: $' + amount.toFixed(2) + '\n🔢 Reference: ' + bankRef + '\n\n⏱️ Bank verification: 1-4 hours', 'success', 8000);
}

// ===================== WITHDRAWAL =====================
function submitWithdrawal() {
    var amount  = parseFloat(document.getElementById('withdrawAmount').value);
    var method  = document.getElementById('withdrawMethod').value;
    var account = document.getElementById('withdrawAccount').value.trim();
    var notes   = document.getElementById('withdrawNotes').value.trim();

    if (!amount || amount < CONFIG.MIN_WITHDRAW)  { showNotification('❌ Minimum withdrawal: $' + CONFIG.MIN_WITHDRAW, 'error'); return; }
    if (amount > currentUser.balance)             { showNotification('❌ Insufficient balance\n\nAvailable: $' + currentUser.balance.toFixed(2), 'error'); return; }
    if (!account)                                 { showNotification('❌ Account details required', 'error'); return; }

    currentUser.balance -= amount;
    notifyAdmin('💸 NEW WITHDRAWAL REQUEST\n\n💰 Amount: $' + amount.toFixed(2) + '\n📱 Method: ' + method.toUpperCase() + '\n👤 User: ' + currentUser.phone + '\n📧 Email: ' + currentUser.email + '\n💳 Account: ' + account + '\n📝 Notes: ' + (notes||'None') + '\n⏰ Time: ' + new Date().toLocaleString() + '\n\n⚠️ Please process within 24 hours.');
    addTransaction({ type:'withdrawal', amount:amount, method:method, status:'pending', reference:account });
    saveUserData();
    updateHomeDisplays();
    closeModal('withdrawModal');
    showNotification('✅ Withdrawal Requested!\n\n💸 Amount: $' + amount.toFixed(2) + '\n📱 Method: ' + method.toUpperCase() + '\n💳 To: ' + account + '\n\n⏱️ Processing: 1-24 hours\nYou\'ll be notified when sent!', 'success', 10000);
}

// ===================== DASHBOARD TRADING =====================
function executeTrade() {
    var pair      = document.getElementById('tradePair').value;
    var direction = document.getElementById('tradeDirection').value;
    var amount    = parseFloat(document.getElementById('tradeAmount').value);
    var leverage  = parseInt(document.getElementById('tradeLeverage').value, 10);

    if (!amount || amount <= 0)       { showNotification('❌ Enter a valid amount.', 'error'); return; }
    if (amount > getActiveBalance())  { showNotification('❌ Insufficient balance.\n\nAvailable: $' + getActiveBalance().toFixed(2), 'error'); return; }

    var win    = Math.random() < 0.6;
    var pnl    = amount * leverage * (Math.random() * 0.02 + 0.005) * (win ? 1 : -1);
    if (pnl < -amount) pnl = -amount;

    var newBal = Math.max(0, getActiveBalance() + pnl);
    setActiveBalance(newBal);
    if (activeAccount === 'real') { currentUser.totalProfit += pnl; currentUser.todayProfit += pnl; }
    saveUserData();
    updateDashDisplays();
    closeModal('tradeModal');

    showNotification(
        (pnl >= 0 ? '✅ Trade Won!' : '❌ Trade Lost') + '\n\n' +
        '📈 Pair: ' + pair + '\n📊 Direction: ' + direction.toUpperCase() +
        '\n💰 Amount: $' + amount.toFixed(2) + ' × ' + leverage + 'x' +
        '\n💵 P/L: ' + (pnl >= 0 ? '+' : '') + '$' + pnl.toFixed(2) +
        '\n📂 Balance: $' + newBal.toFixed(2),
        pnl >= 0 ? 'success' : 'error', 6000
    );
}

// ===================== BOTS =====================
function selectBot(cardEl, type) {
    selectedBotType = type;
    document.querySelectorAll('.bot-card').forEach(function (c) { c.classList.remove('selected'); });
    cardEl.classList.add('selected');
}

function startBot() {
    if (!selectedBotType)  { showNotification('❌ Select a bot first.', 'error'); return; }
    var budget = parseFloat(document.getElementById('botBudget').value);
    if (!budget || budget < 10)          { showNotification('❌ Minimum bot budget is $10.', 'error'); return; }
    if (budget > getActiveBalance())     { showNotification('❌ Insufficient balance.\n\nAvailable: $' + getActiveBalance().toFixed(2), 'error'); return; }

    setActiveBalance(getActiveBalance() - budget);
    currentUser.activeBots.push({ name: selectedBotType, startedAt: Date.now(), budget: budget });
    saveUserData();
    updateDashDisplays();
    closeModal('botModal');
    showNotification('🤖 Bot Started!\n\n🏷️ Type: ' + selectedBotType.toUpperCase() + '\n💰 Budget: $' + budget.toFixed(2) + '\n\nThe bot will generate simulated profits automatically.', 'success', 7000);
}

function startBotSimulation() {
    setInterval(function () {
        if (currentUser.activeBots.length === 0) return;
        var rates  = { conservative:0.005, moderate:0.01, aggressive:0.02, ai:0.015 };
        var profit = 0;
        currentUser.activeBots.forEach(function (bot) {
            if (Math.random() < 0.7) profit += bot.budget * (rates[bot.name] || 0.01) * (0.5 + Math.random());
        });
        if (profit > 0) {
            setActiveBalance(getActiveBalance() + profit);
            if (activeAccount === 'real') { currentUser.totalProfit += profit; currentUser.todayProfit += profit; }
            saveUserData();
            updateDashDisplays();
        }
    }, 30000);
}

// ===================== ADMIN NOTIFICATION =====================
function notifyAdmin(message) {
    var url = 'https://wa.me/' + CONFIG.ADMIN_WHATSAPP.replace(/[^0-9]/g,'') + '?text=' + encodeURIComponent(message);
    if (/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)) window.open(url, '_blank');
    console.log('ADMIN NOTIFICATION:', message);
}

function contactSupport(method, amount) {
    var msg = 'Hi! I need help with my deposit.\n\nAmount: $' + amount + '\nMethod: ' + method + '\nPhone: ' + currentUser.phone;
    window.open('https://wa.me/' + CONFIG.ADMIN_WHATSAPP.replace(/[^0-9]/g,'') + '?text=' + encodeURIComponent(msg), '_blank');
}

// ===================== LOGOUT =====================
function logout() {
    if (confirm('Are you sure? Your local data will be cleared.')) {
        localStorage.removeItem('cryptoproUserAfrica');
        location.reload();
    }
}

// ===================== UTILITIES =====================
function addTransaction(tx) {
    currentUser.transactions.unshift({ id: Date.now(), timestamp: Date.now(), type: tx.type, amount: tx.amount, method: tx.method, status: tx.status, reference: tx.reference });
    saveUserData();
}

function createDynamicModal(id, html) {
    var existing = document.getElementById(id);
    if (existing) existing.remove();
    var modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal active';
    modal.innerHTML = '<div class="modal-content">' + html + '</div>';
    document.body.appendChild(modal);
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(function () {
        showNotification('✅ Copied to clipboard!', 'success', 2000);
    }).catch(function () {
        var i = document.createElement('input');
        i.value = text;
        document.body.appendChild(i);
        i.select();
        document.execCommand('copy');
        document.body.removeChild(i);
        showNotification('✅ Copied!', 'success', 2000);
    });
}

function showNotification(message, type, duration) {
    type     = type     || 'info';
    duration = duration || 5000;
    var el = document.createElement('div');
    el.className   = 'notification ' + type;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add('show'); }, 100);
    setTimeout(function () { el.classList.remove('show'); setTimeout(function () { el.remove(); }, 300); }, duration);
}

console.log('✅ CryptoPro Africa – Single-file build loaded');
</script>
</body>
</html>
