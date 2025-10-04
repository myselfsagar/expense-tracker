
# Expense Tracker App 💰

A full-stack web application to track personal expenses with premium features and detailed analytics.



## Demo

Demo video of the application: 
https://vimeo.com/1086792765/b554c5f7ce?ts=0&share=copy

## Features ✨

- **User Authentication**
  - Signup/Login with JWT
  - Password encryption
- **Profile Management**
  - View or edit profile
  - Reset password
  - Delete account (upcoming)
- **Expense Management**
  - Add/edit/delete expenses
  - Categorize expenses
  - Date filtering (upcoming)
- **Premium Features*** 
  - Download expense reports
  - Leaderboard
  - Advanced analytics (upcoming)
- **Responsive Design** - Works on mobile & desktop
- **Pagination** - Manage large expense lists and improve the performance of the application


## Tech Stack 🛠️

**Frontend:**
- HTML5, CSS3, JavaScript
- Font Awesome (for icons)

**Backend:**
- Node.js with Express
- Sequelize ORM for local and AWS S3 for production
- MySQL
- JWT Authentication

**DevOps:**
- Git version control
- AWS (EC2, S3)
- Jenkins


## Installation ⚙️

### Prerequisites
- Node.js (v14 used)
- MySQL 
- npm
- Account in Send In Blue site for reset password feature
- Account in cashfree for payment feature

### Setup
Clone the project

```bash
  git clone https://github.com/myselfsagar/expense-tracker.git
```

Go to the project directory

```bash
  cd expense-tracker
```
### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

    PORT=3000
    WEBSITE=http://localhost:3000
    ACCESS_TOKEN_SECRET_KEY=''

    #sendInBlue Key for reset password
    SIB_API_KEY=''

    #Cashfree payment
    CASHFREE_APP_ID=''
    CASHFREE_SECRET_KEY=''

    #AWS - optional if not using AWS 
    AWS_ACCESS_KEY_ID=''
    AWS_SECRET_ACCESS_KEY=''
    BUCKET_NAME=''

    #db
    DB_NAME=expense_tracker
    DB_USER=root
    DB_PASSWORD=''
    DB_HOST=localhost || database-1.ap-south-1.rds.amazonaws.com
    DIALECT=mysql
### Run Locally

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node index.js
```


## Project Structure 📂
expense-tracker/
            
├── controllers/          
├── middlewares/          
├── models/  
├── public/           
├── routes/               
├── utils/  
├── services/   
├── utils/  
├── views/               
├── index.js                
└── README.md
## API Endpoints 🌐

| Method | Endpoint     | Description                |
| :-------- | :------- | :------------------------- |
| `GET` | `/home` | Homepage before login |
| `POST` | `/user/signup` | Register new user |
| `POST` | `/user/login` | Login user |
| `GET` | `/user/myProfile` | Get profile details|
| `PUT` | `/user/updateProfile` | Update user profile|
| `POST` | `/expense/addExpense` | Add new expense |
| `GET` | `/expense/getExpenses` | Get paginated expenses |
| `GET` | `/expense/getExpenseById/:eID` | Get expense by ID |
| `PUT` | `/updateExpense/:uID` | Update expense |
| `DELETE` | `/deleteExpense/:dID` | Delete expense |
| `POST` | `/password/forgotPassword` | Send reset password link |
| `GET` | `/password/resetPassword/:resetId` | Verify whether the link is clicked or not |
| `GET` | `/password/updatePassword` | Update password |
| `GET` | `/payment` | payment related route |
| `GET` | `/premium/features` | Get premium features (if premium) |	

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the project

2. Create your feature branch (git checkout -b feature/AmazingFeature)

3. Commit your changes (git commit -m 'Add some amazing feature')

4. Push to the branch (git push origin feature/AmazingFeature)

5. Open a Pull Request

Please adhere to this project's `code of conduct`.


## Authors

- [@sagar](https://github.com/myselfsagar)


## Support 📧

For support, email ssahu6244@gmail.com.

