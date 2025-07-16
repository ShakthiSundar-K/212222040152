## README.md

# URL Shortener Microservice

This is a production-ready HTTP URL Shortener Microservice built using Node.js, TypeScript, Express, and MongoDB. It was developed as part of the AffordMed Backend Assessment and adheres to all specified constraints, including reusable logging middleware, error handling, expiry-based redirection, and full database persistence.

---

## Project Features

* Shortens long URLs and optionally accepts custom shortcodes
* Supports expiration time (in minutes) for each shortened URL
* Redirects based on shortcode, only if the URL is still valid
* Tracks click analytics including timestamp, referrer, and location (mocked)
* Reusable logging middleware that sends structured logs to a remote API
* Logs important events such as errors, warnings, and success messages
* Proper error handling and input validation
* Database used to persist all short URLs and click data

---

## Technologies Used

* Node.js
* TypeScript
* Express.js
* MongoDB (via Mongoose)
* Axios (for remote logging API)
* ts-node-dev (for development runtime)

---

## Project Setup Instructions

1. Clone the repository

```
git clone <repository-url>
cd url-shortener
```

2. Install dependencies

```
npm install
```

3. Set up environment variables

Create a `.env` file in the root of the backend folder and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:5000
ACCESS_TOKEN=your_token
LOG_API_URL=your_url
```

4. Start the server in development mode

```
npm run dev
```

---

## API Endpoints

### POST /shorturls

Creates a new shortened URL.

**Request Body:**

```json
{
  "url": "https://example.com/very/long/link",
  "validity": 45,
  "shortcode": "custom123"
}
```

**Response:**

```json
{
  "shortLink": "http://localhost:5000/custom123",
  "expiry": "2025-01-01T08:30:00Z"
}
```

---

### GET /\:shortcode

Redirects to the original URL if the shortcode is valid and not expired.

**Responses:**

* 302 Redirects to original URL
* 404 if shortcode not found
* 410 if the link has expired

---

### GET /shorturls/\:shortcode

Returns statistics about a shortened URL.

**Response:**

```json
{
  "clicks": 5,
  "originalUrl": "https://example.com/...",
  "createdAt": "...",
  "expiry": "...",
  "clickDetails": [
    {
      "timestamp": "...",
      "referrer": "...",
      "location": "India"
    }
  ]
}
```

---

## Logging Middleware

All log messages are sent to the following test API endpoint:

```
POST http://20.244.56.144/evaluation-service/logs
```

**Log function signature:**

```ts
log(stack: string, level: string, pkg: string, message: string)
```

This logging is applied across the application including services, controllers, error handling, and database connectivity. Console logging is not used anywhere.

---

## Error Handling

All errors are caught using `try-catch` blocks and passed to a global Express error handler. The handler logs the error using the logger middleware and returns descriptive error messages with appropriate status codes.

---

## Database

MongoDB is used to persist data across service restarts. No in-memory storage is used. Each record includes:

* Original URL
* Shortcode
* Creation and expiry timestamps
* Array of click analytics

---

## Testing

You can test the application using Postman or curl. Example test cases include:

* Creating a short URL with and without custom shortcode
* Accessing expired shortcodes
* Fetching statistics
* Triggering 404 and 410 errors
* Sending invalid input to trigger logging and validation errors

---

## Notes

* No authentication is required for any endpoint
* All log levels and packages strictly follow the values allowed in the problem statement
* Logging works silently (no console output) but integrates with the evaluation API
* All TypeScript code is modular, layered, and written in an Object-Oriented pattern wherever applicable

---

