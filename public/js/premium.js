// DOM Elements for Premium Features
const premiumElements = {
  leaderboardList: document.getElementById("leaderboardList"),
  downloadHistoryList: document.getElementById("downloadHistoryList"),
  downloadExpensesButton: document.getElementById("downloadExpensesButton"),
};

// Event Listeners
premiumElements.downloadExpensesButton.addEventListener(
  "click",
  handleDownloadExpenses
);

// Functions
function displayLeaderboard(data) {
  premiumElements.leaderboardList.innerHTML = "";

  data.slice(0, 25).forEach((user, index) => {
    const firstName = user.name.split(" ")[0];
    const item = document.createElement("li");
    item.className = "leaderboard-item";
    item.innerHTML = `${index + 1}. ${firstName} - Expense: ₹${
      user.totalExpense
    }`;
    premiumElements.leaderboardList.appendChild(item);
  });
}

function displayDownloadHistory(data) {
  premiumElements.downloadHistoryList.innerHTML = "";

  if (data.length > 0) {
    data.slice(0, 25).forEach((item) => {
      const date = new Date(item.createdAt).toLocaleString();
      const link = document.createElement("a");
      link.className = "history-item";
      link.href = item.downloadUrl;
      link.textContent = date;
      premiumElements.downloadHistoryList.appendChild(link);
    });
  } else {
    premiumElements.downloadHistoryList.innerHTML =
      '<li class="no-history">No download history available</li>';
  }
}

async function handleDownloadExpenses(e) {
  try {
    e.preventDefault();

    const response = await authenticatedAxios.get("premium/downloadExpenses");
    window.location.href = response.data.result.URL;
    loadPremiumFeatures();
  } catch (error) {
    console.error("Error downloading expenses:", error);
    alert(error.response.data.message);
  }
}

function loadPremiumFeatures() {
  setupPremiumTabs();
  // Load leaderboard data
  authenticatedAxios
    .get("premium/showLeaderboard")
    .then((response) => {
      displayLeaderboard(response.data.result);
    })
    .catch((error) => {
      console.error("Error loading leaderboard:", error);
    });

  // Load download history
  authenticatedAxios
    .get("premium/downloadHistory")
    .then((response) => {
      displayDownloadHistory(response.data.result);
    })
    .catch((error) => {
      console.error("Error loading download history:", error);
    });
}

// Tab Management Functionality
function setupPremiumTabs() {
  // Get all menu items and tab panes
  const menuItems = document.querySelectorAll(".menu-item");
  const tabPanes = document.querySelectorAll(".tab-pane");

  // Set click handlers for each menu item
  menuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      // Get the target pane ID from href
      const targetPaneId = this.getAttribute("href");

      // Special case for Expenses menu
      if (targetPaneId === "#expensesContent") {
        // Scroll to expense table
        expenseTable.scrollIntoView({ behavior: "smooth" });

        // Highlight the expense table
        expenseTable.classList.add("highlighted");
        setTimeout(() => {
          expenseTable.classList.remove("highlighted");
        }, 2000);

        return;
      }

      const targetPane = document.querySelector(targetPaneId);

      if (!targetPane) return;

      // Remove active class from all menu items and panes
      menuItems.forEach((i) => i.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Add active class to clicked menu item and target pane
      this.classList.add("active");
      targetPane.classList.add("active");
    });
  });
}
