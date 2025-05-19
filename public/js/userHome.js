// DOM Elements
const elements = {
  userNameDisplay: document.getElementById("userNameDisplay"),
  userEmailDisplay: document.getElementById("userEmailDisplay"),
  userCategoryDisplay: document.getElementById("userCategoryDisplay"),
  basicUserLogo: document.getElementById("basicUserLogo"),
  premiumUserLogo: document.getElementById("premiumUserLogo"),
  premiumContentSection: document.getElementById("premiumContentSection"),
  advertisementSection: document.getElementById("advertisementSection"),
  lastUpdateDate: document.getElementById("lastUpdateDate"),
  expenseTableBody: document.getElementById("expenseTableBody"),
  totalExpenseAmount: document.getElementById("totalExpenseAmount"),
  logoutButton: document.getElementById("logoutButton"),
  expenseForm: document.getElementById("expenseForm"),
  expenseCategory: document.getElementById("expenseCategory"),
  customCategory: document.getElementById("customCategory"),
  customCategoryGroup: document.getElementById("customCategoryGroup"),
  expenseDescription: document.getElementById("expenseDescription"),
  expenseAmount: document.getElementById("expenseAmount"),
  expenseDate: document.getElementById("expenseDate"),
  expenseId: document.getElementById("expenseId"),
  submitExpenseButton: document.getElementById("submitExpenseButton"),
  successMessage: document.getElementById("successMessage"),
  updateMessage: document.getElementById("updateMessage"),
  buyPremiumButton: document.getElementById("buyPremiumButton"),
  expenseSummary: document.getElementById("expenseSummary"),
  currentPageButton: document.getElementById("currentPage"),
  nextPageButton: document.getElementById("nextPage"),
  previousPageButton: document.getElementById("previousPage"),
  rowsPerPageSelect: document.getElementById("rowsPerPage"),
  paymentModal: document.getElementById("paymentModal"),
  confirmationText: document.getElementById("confirmationText"),
  proceedToPaymentButton: document.getElementById("proceedToPayment"),
  cancelPaymentButton: document.getElementById("cancelPayment"),
  mobileMenuToggle: document.getElementById("mobileMenuToggle"),
  navMenu: document.getElementById("navMenu"),
  downoladBtn: document.getElementById("download-btn"),
};

// Event Listeners
elements.expenseCategory.addEventListener("change", handleCustomCategory);
elements.submitExpenseButton.addEventListener("click", handleExpenseSubmit);
elements.expenseTableBody.addEventListener("click", handleTableActions);
elements.buyPremiumButton.addEventListener("click", handlePremiumPurchase);
elements.logoutButton.addEventListener("click", handleLogout);
elements.previousPageButton.addEventListener("click", goToPreviousPage);
elements.nextPageButton.addEventListener("click", goToNextPage);
elements.rowsPerPageSelect.addEventListener("change", changeRowsPerPage);
elements.proceedToPaymentButton.addEventListener("click", proceedWithPayment);
elements.cancelPaymentButton.addEventListener("click", closePaymentModal);
elements.mobileMenuToggle.addEventListener("click", toggleMobileMenu);

// Global Variables
let authenticatedAxios = createAuthenticatedAxios();
let currentUser = {
  name: "",
  email: "",
  role: "basic",
};
let currentPage = 1;
let hasMoreExpenses = false;
let hasPreviousExpenses = false;
let rowsPerPage = 5;
const cashfree = Cashfree({ mode: "sandbox" });

// Initialize the application
initializeApplication();

// Functions
function initializeApplication() {
  setupUserProfile();
  loadExpenses();
}

function createAuthenticatedAxios() {
  const token = localStorage.getItem("access_token");
  if (token) {
    return axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    window.location.href = "/home";
    return;
  }
}

function setupUserProfile() {
  authenticatedAxios
    .get("user/currentUser")
    .then((response) => {
      const { name, email, role } = response.data.result;
      currentUser = { name, email, role };

      elements.userNameDisplay.textContent = name;
      elements.userEmailDisplay.textContent = email;

      if (role === "premium") {
        elements.premiumUserLogo.classList.remove("hidden");
        elements.premiumContentSection.classList.remove("hidden");
        elements.downoladBtn.classList.remove("hidden");
        elements.userCategoryDisplay.textContent = "Premium User";
        loadPremiumFeatures();
      } else {
        elements.basicUserLogo.classList.remove("hidden");
        elements.advertisementSection.classList.remove("hidden");
        elements.userCategoryDisplay.textContent = "Basic User";
      }
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
      window.location.href = "/home";
    });
}

async function loadExpenses() {
  try {
    const response = await authenticatedAxios.get(
      `expense/getExpenses?page=${currentPage}&limit=${rowsPerPage}`
    );
    displayExpenses(response.data.result);
  } catch (error) {
    handleExpenseError(error);
  }
}

function displayExpenses(data) {
  elements.expenseTableBody.innerHTML = "";
  elements.totalExpenseAmount.textContent = `₹${data.totalExpense}`;

  hasMoreExpenses = data.hasMoreExpenses;
  hasPreviousExpenses = data.hasPreviousExpenses;

  if (data.expenses.length > 0) {
    // Calculate the range text
    const startItem = (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(
      currentPage * rowsPerPage,
      data.totalExpenses || startItem + data.expenses.length - 1
    );

    elements.expenseSummary.textContent = `Showing ${startItem}-${endItem} of ${data.totalCount}`;

    data.expenses.forEach((expense, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>${expense.amount}</td>
                <td>${expense.date}</td>
                <td>
                    <a href="#expenseFormSection">
                        <button class="edit-button" data-id="${
                          expense.id
                        }">Edit</button>
                    </a>
                </td>
                <td>
                    <button class="delete-button" data-id="${
                      expense.id
                    }">Delete</button>
                </td>
            `;
      elements.expenseTableBody.appendChild(row);
    });

    const lastUpdated = new Date(
      data.expenses[0].createdAt
    ).toLocaleDateString();

    elements.lastUpdateDate.textContent = lastUpdated;
  } else {
    elements.expenseSummary.textContent = "Showing 0 of 0";
    elements.lastUpdateDate.textContent = "No data available";
  }

  updatePaginationControls();
}

function updatePaginationControls() {
  elements.currentPageButton.textContent = currentPage;
  elements.previousPageButton.disabled = !hasPreviousExpenses;
  elements.nextPageButton.disabled = !hasMoreExpenses;
}

function handleCustomCategory() {
  if (this.value === "Other") {
    elements.customCategoryGroup.classList.remove("hidden");
    elements.customCategory.required = true;
  } else {
    elements.customCategoryGroup.classList.add("hidden");
    elements.customCategory.required = false;
  }
}

async function handleExpenseSubmit(e) {
  if (
    e.target.classList.contains("submit-button") &&
    elements.expenseForm.checkValidity()
  ) {
    e.preventDefault();

    // Safely get category value
    let categoryValue = elements.expenseCategory.value;
    if (categoryValue === "Other") {
      const customCategory = document.getElementById("customCategory");
      if (!customCategory || !customCategory.value) {
        alert("Please enter a custom category");
        return;
      }
      categoryValue = customCategory.value;
    }

    const expenseData = {
      category: categoryValue,
      description: elements.expenseDescription.value,
      amount: elements.expenseAmount.value,
      date: elements.expenseDate.value,
    };

    try {
      if (elements.expenseId.value === "") {
        // Add new expense
        const response = await authenticatedAxios.post(
          "expense/addExpense",
          expenseData
        );

        // Verify response structure
        if (response.data?.result?.expense) {
          // loadExpenses();
          addExpenseToUI(response.data.result.expense);
          updateTotalExpense(response.data.result.totalExpense);
          showSuccessMessage();
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        // Update existing expense
        const response = await authenticatedAxios.put(
          `expense/updateExpense/${elements.expenseId.value}`,
          expenseData
        );

        if (response.data?.result?.expense) {
          updateExpenseInUI(response.data.result.expense);
          updateTotalExpense(response.data.result.totalExpense);
          showUpdateMessage();
        } else {
          throw new Error("Invalid response format");
        }
      }

      clearFormFields();
      if (currentUser.role === "premium") loadPremiumFeatures();
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Operation failed");
    }
  }
}

function addExpenseToUI(expense) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>1</td> <!-- Will be renumbered -->
    <td>${expense.category}</td>
    <td>${expense.description}</td>
    <td>${expense.amount}</td>
    <td>${expense.date}</td>
    <td>
      <button class="edit-button" data-id="${expense.id}">Edit</button>
    </td>
    <td>
      <button class="delete-button" data-id="${expense.id}">Delete</button>
    </td>
  `;
  elements.expenseTableBody.prepend(row);

  // Check if we've exceeded the row limit
  const currentRows = elements.expenseTableBody.querySelectorAll("tr");
  if (currentRows.length > rowsPerPage) {
    currentRows[rowsPerPage]?.remove();
  }

  if (currentPage === 1) {
    const currentText = elements.expenseSummary.textContent;
    const matches = currentText.match(/Showing (\d+)-(\d+) of (\d+)/);
    if (matches) {
      const total = parseInt(matches[3]) + 1;
      elements.expenseSummary.textContent = `Showing 1-${Math.min(
        rowsPerPage,
        total
      )} of ${total}`;
    }
  }

  elements.lastUpdateDate.textContent = new Date().toLocaleDateString();

  renumberRows();
}

function updateExpenseInUI(expense) {
  const row = document
    .querySelector(`[data-id="${expense.id}"]`)
    ?.closest("tr");
  if (row) {
    row.cells[1].textContent = expense.category;
    row.cells[2].textContent = expense.description;
    row.cells[3].textContent = `₹ {expense.amount}`;
    row.cells[4].textContent = expense.date;
    elements.lastUpdateDate.textContent = new Date().toLocaleDateString();
  }
}

function renumberRows() {
  const rows = elements.expenseTableBody.querySelectorAll("tr");
  rows.forEach((row, index) => {
    row.cells[0].textContent = index + 1;
  });
}

function updateTotalExpense(total) {
  elements.totalExpenseAmount.textContent = `₹${total}`;
}

function showSuccessMessage() {
  elements.successMessage.classList.remove("hidden");
  setTimeout(() => {
    elements.successMessage.classList.add("hidden");
  }, 3000);
}

function showUpdateMessage() {
  elements.updateMessage.classList.remove("hidden");
  setTimeout(() => {
    elements.updateMessage.classList.add("hidden");
  }, 3000);
}

function clearFormFields() {
  elements.expenseCategory.value = "";
  elements.expenseDescription.value = "";
  elements.expenseAmount.value = "";
  elements.expenseDate.value = "";
  elements.expenseId.value = "";
  elements.submitExpenseButton.textContent = "Add Expense";

  document.getElementById("customCategoryGroup").classList.add("hidden");
  document.getElementById("customCategory").required = false;
  document.getElementById("customCategory").value = "";
}

function handleTableActions(e) {
  if (e.target.classList.contains("delete-button")) {
    handleDeleteExpense(e.target.dataset.id);
  } else if (e.target.classList.contains("edit-button")) {
    handleEditExpense(e.target.dataset.id);
  }
}

async function handleDeleteExpense(expenseId) {
  try {
    if (confirm("Are you sure you want to delete this expense?")) {
      const response = await authenticatedAxios.delete(
        `expense/deleteExpense/${expenseId}`
      );

      const row = document
        .querySelector(`[data-id="${expenseId}"]`)
        ?.closest("tr");
      if (row) {
        row.remove();
        renumberRows();

        updateTotalExpense(response.data.result.totalExpense);
        elements.lastUpdateDate.textContent = new Date().toLocaleDateString();

        if (currentUser.role === "premium") loadPremiumFeatures();
      }

      // Update the expenseSummary count
      const currentText = elements.expenseSummary.textContent;
      const matches = currentText.match(/Showing (\d+)-(\d+) of (\d+)/);
      if (matches) {
        const total = parseInt(matches[3]) - 1;
        const start = parseInt(matches[1]);
        let end = parseInt(matches[2]);

        // Adjust if we deleted the last item in the range
        if (end > total) end = total;

        elements.expenseSummary.textContent = `Showing ${start}-${end} of ${total}`;
      }
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
}

function handleEditExpense(expenseId) {
  authenticatedAxios
    .get(`expense/getExpenseByID/${expenseId}`)
    .then((response) => {
      const expense = response.data.result[0];
      elements.expenseCategory.value = expense.category;
      elements.expenseDescription.value = expense.description;
      elements.expenseAmount.value = expense.amount;
      elements.expenseDate.value = expense.date;
      elements.expenseId.value = expenseId;
      elements.submitExpenseButton.textContent = "Update Expense";
    })
    .catch((error) => {
      console.error("Error fetching expense:", error);
      loadExpenses();
    });
}

function handlePremiumPurchase(e) {
  e.preventDefault();
  elements.confirmationText.innerHTML = `<strong>Hi ${currentUser.name}</strong>`;
  elements.paymentModal.classList.remove("hidden");
}

async function proceedWithPayment() {
  try {
    // Fetch payment session ID from backend
    const response = await authenticatedAxios.post(`payment/pay`, {});

    const { paymentSessionId, orderId } = response.data;

    // Initialize checkout options
    let checkoutOptions = {
      paymentSessionId,
      // redirectTarget: "_self",
      //? Modal payment options
      redirectTarget: "_modal",
      //? Inline payment options
      // redirectTarget: document.getElementById("cf_checkout"),
      // appearance: {
      //   width: "425px",
      //   height: "700px",
      // },
    };

    // Start the checkout process
    const result = await cashfree.checkout(checkoutOptions);

    if (result.error) {
      // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
      console.log(
        "User has closed the popup or there is some payment error, Check for Payment Status"
      );
      console.log(result.error);
    }
    if (result.redirect) {
      // This will be true when the payment redirection page couldn't be opened in the same window
      // This is an exceptional case only when the page is opened inside an inAppBrowser
      // In this case the customer will be redirected to return url once payment is completed
      console.log("Payment will be redirected");
    }
    if (result.paymentDetails) {
      // This will be called whenever the payment is completed irrespective of transaction status
      console.log("Payment has been completed, Check for Payment Status");
      console.log(result.paymentDetails.paymentMessage);

      const response = await authenticatedAxios.get(
        `payment/payment-status/${orderId}`
      );

      if (response.data.orderStatus === "Success") {
        localStorage.setItem("user_role", "premium");
        window.location.reload();
      }
      alert("Your payment is " + response.data.orderStatus);
    }
  } catch (err) {
    console.error("Error initiating payment:", err.message);
    alert("Payment error. Please try again.");
  }
}

function closePaymentModal() {
  elements.paymentModal.classList.add("hidden");
}

function handleLogout() {
  localStorage.removeItem("access_token");
  window.location.href = "/home";
}

function goToPreviousPage() {
  if (hasPreviousExpenses) {
    currentPage--;
    loadExpenses();
  }
}

function goToNextPage() {
  if (hasMoreExpenses) {
    currentPage++;
    loadExpenses();
  }
}

function changeRowsPerPage() {
  rowsPerPage = parseInt(elements.rowsPerPageSelect.value);
  currentPage = 1;
  loadExpenses();
}

function toggleMobileMenu() {
  elements.navMenu.classList.toggle("active");
}

function handleExpenseError(error) {
  if (error.response && error.response.statusCode === 401) {
    alert(error.response.data.message);
    window.location.href = "home";
  } else {
    console.error("Error:", error);
    alert("Something went wrong. Kindly relogin.");
    window.location.replace("home");
  }
}

function loadPremiumFeatures() {
  // This function is implemented in premiumFeatures.js
}
