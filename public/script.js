// 1. VARIABLES AT THE TOP
let myChart;
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('transaction-form');
const descInp = document.getElementById('desc');
const amountInp = document.getElementById('amount');
const categoryInp = document.getElementById('category');

// 2. FETCH AND DISPLAY (The "Read" Part)
async function getTransactions() {
    try {
        const currency = document.getElementById('currency-select').value;
        const res = await fetch('/api/transactions');
        const transactions = await res.json();
        
        list.innerHTML = '';
        let income = 0;
        let expense = 0;

        transactions.forEach(t => {
            const item = document.createElement('li');
            const date = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            // CRITICAL FIX: data-category is added here so the CSS can see it
            item.innerHTML = `
                <div>
                    <span style="font-weight:bold;">${t.text}</span>
                    <span class="item-category" data-category="${t.category}">${t.category || 'Other'}</span>
                    <small style="display:block; color:gray; font-size:10px;">${date}</small>
                </div>
                <div style="text-align:right;">
                    <span style="font-weight:bold; display:block;">
                        ${t.amount < 0 ? '-' : '+'}${currency}${Math.abs(t.amount).toFixed(2)}
                    </span>
                    <button onclick="editItem('${t._id}', '${t.text}', ${t.amount}, '${t.category}')" 
                            style="background:orange; color:white; border:none; padding:2px 5px; border-radius:3px; cursor:pointer;">Edit</button>
                    <button onclick="deleteItem('${t._id}')" 
                            style="background:red; color:white; border:none; padding:2px 5px; border-radius:3px; cursor:pointer;">X</button>
                </div>
            `;
            list.appendChild(item);

            if (t.amount > 0) income += t.amount;
            else expense += t.amount;
        });

        // Update Summary Totals
        balanceEl.innerText = `${currency}${(income + expense).toFixed(2)}`;
        incomeEl.innerText = `${currency}${income.toFixed(2)}`;
        expenseEl.innerText = `${currency}${Math.abs(expense).toFixed(2)}`;

        showChart(income, expense);
    } catch (err) { console.error("Fetch Error:", err); }
}

// 3. EDIT LOGIC (Updates UI to "Update Mode")
function editItem(id, text, amount, category) {
    descInp.value = text;
    amountInp.value = amount;
    categoryInp.value = category || 'Other';
    
    // UI Change: Feedback for the user
    const saveBtn = document.querySelector('.save-btn');
    saveBtn.innerText = "Update Transaction";
    saveBtn.style.backgroundColor = "#f39c12"; // Orange color for edit mode

    // We delete the old one so the "Save" creates a fresh version
    deleteItem(id, false); 
    descInp.focus();
}

// 4. DELETE LOGIC
async function deleteItem(id, confirmMsg = true) {
    if (confirmMsg && !confirm('Are you sure you want to delete this?')) return;
    
    try {
        await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
        getTransactions();
    } catch (err) { console.error("Delete Error:", err); }
}

// 5. CHART LOGIC
function showChart(inc, exp) {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChart) { myChart.destroy(); }

    myChart = new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [inc, Math.abs(exp)],
                backgroundColor: ['#2ecc71', '#e74c3c']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

// 6. SUBMIT LOGIC
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const saveBtn = document.querySelector('.save-btn');
    
    await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            text: descInp.value, 
            amount: Number(amountInp.value),
            category: categoryInp.value 
        })
    });

    // Reset UI to "Save Mode"
    saveBtn.innerText = "Save Transaction";
    saveBtn.style.backgroundColor = "#2980b9"; // Back to original blue
    
    form.reset();
    getTransactions();
});

// 7. INITIAL RUN
window.onload = getTransactions;