// 1. ALWAYS put variables at the top
let chart; 
let transactions = JSON.parse(localStorage.getItem("myTransactions")) || [];

// 2. Define all your functions
function add() {
  let desc = document.getElementById("desc").value;
  let amount = Number(document.getElementById("amount").value);

  if (desc === "" || amount === 0) {
    alert("Please fill description and amount");
    return;
  }

  let item = { id: Date.now(), text: desc, value: amount };
  transactions.push(item);

  saveData();
  showList();
  updateBalance();

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

function editItem(id, text, amount, category) {
    descInp.value = text;
    amountInp.value = amount;
    categoryInp.value = category || 'Other';
    
    // Change the button color and text to show we are editing
    const saveBtn = document.querySelector('.btn');
    saveBtn.innerText = "Update Transaction";
    saveBtn.style.backgroundColor = "orange";

    deleteItem(id, false); 
    descInp.focus();
}

function deleteItem(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveData();
  showList();
  updateBalance();
}

function saveData() {
  localStorage.setItem("myTransactions", JSON.stringify(transactions));
}

function showList() {
  let list = document.getElementById("list");
  list.innerHTML = "";
  
  transactions.forEach(function (t) {
    let li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";

    li.innerHTML = `
      <span>${t.text} : ${t.value}</span>
      <div>
        <button onclick="editItem(${t.id})" style="background:orange; padding:2px 5px; width:auto; display:inline;">Edit</button>
        <button onclick="deleteItem(${t.id})" style="background:red; padding:2px 5px; width:auto; display:inline;">X</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function updateBalance() {
  let income = 0;
  let expense = 0;

  transactions.forEach(function (t) {
    if (t.value > 0) income += t.value;
    else expense += t.value;
  });

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = income + expense;

  // Now this will work because chart is declared at the top
  showChart(income, expense);
}

function showChart(inc, exp) {
    const canvas = document.getElementById('myChart');
    if (!canvas) return; // Safety check

    const ctx = canvas.getContext('2d');

    if (chart) { chart.destroy(); }

    chart = new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                label: 'Amount',
                data: [inc, Math.abs(exp)],
                backgroundColor: ['#2ecc71', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 3. RUN the initial logic LAST
showList();
updateBalance();