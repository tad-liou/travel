const config = {
    'day1': { title: 'Day 01', sub: '01/22 Arrival', icon: 'plane-landing' },
    'day2': { title: 'Day 02', sub: '01/23 Explore', icon: 'fish' },
    'day3': { title: 'Day 03', sub: '01/24 Shopping', icon: 'shopping-bag' },
    'day4': { title: 'Day 04', sub: '01/25 Gourmet', icon: 'utensils-crossed' },
    'day5': { title: 'Day 05', sub: '01/26 Departure', icon: 'plane-takeoff' },
    'shopping': { title: 'Shopping', sub: '慾望清單', icon: 'list-checks' },
    'expense': { title: 'Expenses', sub: '開銷統計', icon: 'wallet' }
};

let shoppingData = JSON.parse(localStorage.getItem('oka_shop') || '[]');
let expenseData = JSON.parse(localStorage.getItem('oka_exp') || '[]');

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    const page = config[tabId];
    document.getElementById('page-title').innerText = page.title;
    document.getElementById('page-subtitle').innerText = page.sub;
    
    const headerIcon = document.getElementById('header-icon');
    headerIcon.setAttribute('data-lucide', page.icon);
    
    document.querySelectorAll('.nav-item').forEach((item, idx) => {
        const tabs = Object.keys(config);
        item.classList.toggle('active', tabs[idx] === tabId);
    });

    if(tabId === 'shopping') renderShopping();
    if(tabId === 'expense') renderExpense();
    
    lucide.createIcons();
    window.scrollTo(0, 0);
}

function addItem(type) {
    if(type === 'shopping') {
        const input = document.getElementById('shop-input');
        if(!input.value) return;
        shoppingData.push({ id: Date.now(), text: input.value, done: false });
        input.value = '';
        saveData();
        renderShopping();
    } else {
        const title = document.getElementById('exp-title'), amount = document.getElementById('exp-amount'), pay = document.getElementById('exp-pay'), user = document.getElementById('exp-user');
        if(!title.value || !amount.value) return;
        expenseData.push({ id: Date.now(), title: title.value, amount: parseFloat(amount.value), method: pay.value, user: user.value });
        title.value = ''; amount.value = '';
        saveData();
        renderExpense();
    }
}

function toggleShop(id) {
    shoppingData = shoppingData.map(i => i.id === id ? {...i, done: !i.done} : i);
    saveData(); renderShopping();
}

function deleteItem(type, id) {
    if(type === 'shopping') shoppingData = shoppingData.filter(i => i.id !== id);
    else expenseData = expenseData.filter(i => i.id !== id);
    saveData();
    type === 'shopping' ? renderShopping() : renderExpense();
}

function saveData() {
    localStorage.setItem('oka_shop', JSON.stringify(shoppingData));
    localStorage.setItem('oka_exp', JSON.stringify(expenseData));
}

function renderShopping() {
    const container = document.getElementById('shop-list');
    container.innerHTML = shoppingData.map(item => `
        <div class="list-item">
            <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleShop(${item.id})">
            <span class="flex-1 ${item.done ? 'line-through opacity-40' : 'font-bold'}">${item.text}</span>
            <button onclick="deleteItem('shopping', ${item.id})" class="text-red-300"><i data-lucide="trash-2" size="16"></i></button>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderExpense() {
    const container = document.getElementById('exp-list');
    let total = 0;
    container.innerHTML = expenseData.map(item => {
        total += item.amount;
        return `
        <div class="list-item">
            <div class="flex-1">
                <div class="font-bold text-sm">${item.title}</div>
                <div class="flex gap-2 mt-1"><span class="expense-badge">${item.method}</span><span class="expense-badge text-blue-500">${item.user}</span></div>
            </div>
            <div class="text-right">
                <div class="font-black text-blue-600">¥${item.amount.toLocaleString()}</div>
                <button onclick="deleteItem('expense', ${item.id})" class="text-[10px] text-red-400 font-bold">刪除</button>
            </div>
        </div>`;
    }).join('');
    document.getElementById('total-amount').innerText = `¥ ${total.toLocaleString()}`;
    lucide.createIcons();
}

window.onload = () => {
    lucide.createIcons();
    renderShopping();
    renderExpense();
};