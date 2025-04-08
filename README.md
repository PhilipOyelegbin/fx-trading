# FX Trading App Backend

This project provides the core functionality to manage users, wallets, currency trading, and real-time FX rate integration.

---

## **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd fx-trading
```

### **2. Install Dependencies**

```bash
yarn
```

### **3. Set Up Environment Variables**

Create a `.env` file at the root of the project and add the following configuration:

```plaintext
# App port
PORT=3030

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=fxtradingdb

# JWT
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRATION_TIME="1h"

# Mail Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_email_password

# RapidApi (Currency Conversion and Exchange Rates)
RAPIDAPI_KEY=<your_api_key>
RAPIDAPI_HOST=<your_host_api>
```

### **4. Configure the Database**

1. Make sure **MySQL** is installed on your machine.
2. Create a database named `fxtradingdb`.

### **5. Run the Application**

```bash
yarn run start:dev
```

---

## **Key Assumptions**

1. **Currency Support**: The system supports NGN, USD, EUR, GBP, and other international currencies. Ensure the wallet entity has been configured correctly for multi-currency support.
2. **Authentication**: Users authenticate using JWT tokens.
3. **Real-Time FX Rates**: External FX rate APIs (e.g., RapidAPi: Currency Conversion and Exchange Rates) are used for fetching real-time rates. A caching package (e.g., memory-cache) is assumed for efficiency.
4. **Email Verification**: Users must verify their email addresses before performing wallet or trading operations.
5. **Database**: MySQL is used to store user, wallet, and transaction data.

---

## **API Documentation**

### **Swagger Integration**

Swagger has been integrated into the project for API documentation. Once the app is running, access the documentation at:

```
http://localhost:<SPECIFIED_PORT>
```

---

## **Summary of Architectural Decisions**

### **Backend Framework**

- **NestJS**: Chosen for its modular structure, scalability, and out-of-the-box support for dependency injection.

### **ORM**

- **TypeORM**: Provides robust and easy-to-use database management and supports relational data.

### **Database**

- **MySQL**: Offers scalability and advanced features for structured data.

### **Authentication**

- **JWT**: Used for user authentication and authorization. Ensures secure and stateless token-based access.

### **Mail System**

- **Webmail SMTP**: Integrated for sending email verifications. Configured using NestJS's `@nestjs-modules/mailer`.

### **Real-Time FX Rates**

- Integrated external FX rate APIs with caching using memory-cache to avoid unnecessary API calls.

### **Modular Design**

The application follows a modular architecture:

- **User Module**: Manages user-related functionality.
- **Wallet Module**: Handles wallet operations and multi-currency support.
- **Trading Module**: Processes currency trading and real-time FX conversions.
