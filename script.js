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
  totalAmount = 0;
  const rows = document.querySelectorAll('#all_expenses tr');
  rows.forEach(row => {
    const amountCell = row.querySelector('td:nth-child(2)');
    totalAmount += parseFloat(amountCell.innerText);
  });
  expensetotal.innerText = "Total: "+totalAmount.toFixed(2);
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
  document.cookie = `expenses=${encodeURIComponent(JSON.stringify(expenses))}; path=/; max-age=31536000;`; // Expires in 1 year
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

window.addEventListener('load', loadExpenses);
window.addEventListener('beforeunload', saveExpenses);
