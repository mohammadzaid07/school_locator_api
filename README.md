# School Locator API

This project is a simple RESTful API for managing and querying school locations. It allows users to add schools with their details and retrieve a list of schools sorted by proximity to a given location. The backend is built using **Node.js (Express)** and **MySQL**.

---

## Features

- **Add School**: Add new schools with name, address, latitude, and longitude.
- **List Schools**: Retrieve all schools, sorted by distance to a user-specified location.
- **Input Validation**: Ensures all required fields are provided and valid.
- **Distance Calculation**: Uses the Haversine formula to compute real-world distances.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MySQL](https://www.mysql.com/) server

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up the Database

1. **Create a Database:**

   Open MySQL Workbench or your preferred MySQL client, and run:

   ```sql
   CREATE DATABASE your_db_name;
   USE your_db_name;
   ```
2. **Create the Table:**

   ```sql
   CREATE TABLE schools_table (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       address VARCHAR(255) NOT NULL,
       latitude FLOAT NOT NULL,
       longitude FLOAT NOT NULL
   );
   ```

### 4. Configure Database Credentials Using `.env`

Create a `.env` file in the root of your project and add the following (without quotes or extra spaces):

```
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_DATABASE=your_db_name
```

**Note:**

- Replace each value with your actual MySQL and application configuration.
- Never commit your `.env` file to public repositories.

### 5. Update Database Configuration in the Code

Ensure your `index.js` uses the environment variables:

```js
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```

### 6. Start the Server

```sh
node index.js
```

Server should run on `http://localhost:3000` (or the port you set in `.env`).

---

## API Documentation

### 1. Add School

- **Endpoint:** `/addSchool`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Body Example:**
  ```json
  {
    "name": "ABC School",
    "address": "123 Main St, City",
    "latitude": 28.6139,
    "longitude": 77.2090
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "School added successfully",
    "id": 1
  }
  ```

### 2. List Schools (Sorted by Proximity)

- **Endpoint:** `/listSchools`
- **Method:** `GET`
- **Query Parameters:**
  - `latitude` (required, float)
  - `longitude` (required, float)
- **Example:**
  ```
  http://localhost:3000/listSchools?latitude=28.6139&longitude=77.2090
  ```
- **Response Example:**
  ```json
  [
    {
      "id": 1,
      "name": "ABC School",
      "address": "123 Main St, City",
      "latitude": 28.6139,
      "longitude": 77.2090,
      "distance": 0.0
    },
    ...
  ]
  ```

---

## Testing with Postman

### Add a School

- **Method:** `POST`
- **URL:** `http://localhost:3000/addSchool`
- **Body:** (raw, JSON)
  ```json
  {
    "name": "ABC School",
    "address": "123 Main St, City",
    "latitude": 28.6139,
    "longitude": 77.2090
  }
  ```

### List Schools

- **Method:** `GET`
- **URL:**
  `http://localhost:3000/listSchools?latitude=28.6139&longitude=77.2090`

---

## Project Structure

```
.
├── index.js          # Main API server
├── package.json      # NPM dependencies
├── .env              # Environment variables (DO NOT COMMIT)
└── README.md         # This documentation
```

---

## Customization & Deployment

- **Environment Variables:** For production, always use environment variables and keep your `.env` file secure.
- **Error Handling:** Extend error handling as required.
- **Deployment:** Can be deployed to any Node.js-friendly platform (Heroku, Render, AWS, etc.). Set the environment variables in your host's dashboard.
- **Security:** Use HTTPS and proper authentication mechanisms for production.

---

## License

This project is licensed under the MIT License.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## Contact

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com).
