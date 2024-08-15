let totalAmount;
const expensetotal = document.getElementById('total-amount');
function addExpense(){
  const expenseName = document.getElementById('input');
  const expenseAmount = document.getElementById('amount');
  const expenseForm = document.getElementById('expense-form');
  const expenseTable = document.getElementById('all_expenses');
  const expense = {
    name: expenseName.value,
    amount: expenseAmount.value
  }
  if(expense.name === '' || expense.amount === ''){
    alert('Expense cannot be empty');
  }
  else{
    expenseForm.reset();
    const expenseRow = document.createElement('tr');
    const expenseNameCell = document.createElement('td');
    const expenseAmountCell = document.createElement('td');
    const expenseDeleteCell = document.createElement('td');
    expenseNameCell.innerText = expense.name;
    expenseAmountCell.innerText = expense.amount;

    const delBtn = document.createElement('button');
    delBtn.innerText = 'Delete';
    delBtn.setAttribute('onclick', 'deleteExpense(this)');

    expenseDeleteCell.appendChild(delBtn);
    expenseRow.appendChild(expenseNameCell);
    expenseRow.appendChild(expenseAmountCell);
    expenseRow.appendChild(expenseDeleteCell);
    expenseTable.appendChild(expenseRow);
    updateTotal();
  }
  
}
function updateTotal() {
  const budget_limit = document.getElementById('budget-limit-input');
  if (budget_limit.value === ''){
    expensetotal.style.color = 'black';
    totalAmount = 0;
    const rows = document.querySelectorAll('#all_expenses tr');
    rows.forEach(row => {
      const amountCell = row.querySelector('td:nth-child(2)');
      totalAmount += parseFloat(amountCell.innerText);
    });
    expensetotal.innerText = "Total: "+totalAmount.toFixed(2);
  }
  else{
    totalAmount = 0;
    const rows = document.querySelectorAll('#all_expenses tr');
    rows.forEach(row => {
      const amountCell = row.querySelector('td:nth-child(2)');
      totalAmount += parseFloat(amountCell.innerText);
    });
    total = totalAmount.toFixed(2);
    if (totalAmount > budget_limit.value){
      expensetotal.innerText = "Total: "+totalAmount.toFixed(2)+" (Over budget by "+(totalAmount-budget_limit.value).toFixed(2)+")";
      expensetotal.style.color = 'red';
    }
    else if (totalAmount > budget_limit.value-100){
      expensetotal.innerText = "Total: "+totalAmount.toFixed(2)+" (You are almost over budget)";
      expensetotal.style.color = 'orange';
    }
    else {
      expensetotal.innerText = "Total: "+totalAmount.toFixed(2);
      expensetotal.style.color = 'green';
    }
  }
  
  
}

updateTotal();
function deleteExpense(button){
  const expenseRow = button.parentElement.parentElement;
  expenseRow.remove();
  saveExpenses(); 
  updateTotal();
}


function saveExpenses() {
  const expenses = [];
  const rows = document.querySelectorAll('#all_expenses tr');
  rows.forEach(row => {
    const name = row.querySelector('td:nth-child(1)').innerText;
    const amount = row.querySelector('td:nth-child(2)').innerText;
    expenses.push({ name, amount });
  });
  document.cookie = `expenses=${encodeURIComponent(JSON.stringify(expenses))}; path=/; max-age=31536000;`;
}

function loadExpenses() {
  
  const cookie = document.cookie;
  const expensesCookie = cookie.split(';').find(c => c.trim().startsWith('expenses='));
  if (expensesCookie) {
    const expenses = decodeURIComponent(expensesCookie.split('=')[1]);
    const parsedExpenses = JSON.parse(expenses);
    const expenseTable = document.getElementById('all_expenses');
    parsedExpenses.forEach(expense => {
      const expenseRow = document.createElement('tr');
      const expenseNameCell = document.createElement('td');
      const expenseAmountCell = document.createElement('td');
      const expenseDeleteCell = document.createElement('td');
      expenseNameCell.innerText = expense.name;
      expenseAmountCell.innerText = expense.amount;

      const delBtn = document.createElement('button');
      delBtn.innerText = 'Delete';
      delBtn.setAttribute('onclick', 'deleteExpense(this)');

      expenseDeleteCell.appendChild(delBtn);
      expenseRow.appendChild(expenseNameCell);
      expenseRow.appendChild(expenseAmountCell);
      expenseRow.appendChild(expenseDeleteCell);
      expenseTable.appendChild(expenseRow);
    });
  }
  updateTotal();
}

function clearExpenses(){
  const expenseTable = document.getElementById('all_expenses');
  expenseTable.innerHTML = '';
  saveExpenses();
  updateTotal();
}

window.addEventListener('load', loadExpenses);
window.addEventListener('beforeunload', saveExpenses);


