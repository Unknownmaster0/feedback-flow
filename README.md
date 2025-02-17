# Feedback Message

## Description
**Feedback Message** is a web application that allows users to send and receive feedback messages. The app provides an AI-suggested message feature that generates responses using an LLM model. Users can also control whether they want to receive feedback using a "Focus/Busy" toggle.

## Features
- View all registered users on the homepage.
- Send feedback messages to any user.
- AI-suggested messages for easy responses.
- User authentication for secure access.
- View received feedback messages after logging in.
- "Focus/Busy" mode to control feedback reception.

## Tech Stack
### Frontend
- **Next.js** – React-based framework for server-side rendering and static site generation.
- **Tailwind CSS** – For styling.

### Backend
- **MongoDB** – NoSQL database for storing user data and messages.
- **Mongoose** – ORM for MongoDB to handle schema and queries.
- **NextAuth.js** – Authentication handling.
- **AI Integration** – Uses an LLM model to generate AI-suggested messages.

## How to Run Locally
### Prerequisites
Ensure you have the following installed:
- **Node.js** (v14+ recommended)
- **MongoDB** (local or cloud-based)

### Steps to Run
1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd feedback-message
   ```
2. **Install dependencies:**
   ```sh
   yarn
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the required variables:
     ```env
     MONGO_URI=your_mongodb_connection_string
     NEXTAUTH_SECRET=your_nextauth_secret
     AI_API_KEY=your_ai_model_api_key
     ```
4. **Run the development server:**
   ```sh
   yarn dev
   ```
   The app should now be running at **http://localhost:3000**.

## Usage
1. Open the homepage to see the list of users.
2. Click on a user profile to send them feedback.
3. Use the **"Get AI Suggested Message"** button for an AI-generated response.
4. Log in to view the feedback you have received.
5. Toggle **Focus/Busy** mode to enable or disable feedback reception.

## Author
**Sagar Singh**

## License
This project is licensed under the MIT License.
