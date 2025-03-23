## Personal Banker
**Full Stack Banking Application**

This project uses the MERN tech stack for frontend and backend and the Sambanova API to perform the image analysis on receipts and checks

**Technologies Used:**

* **Backend:**
    * **Node.js:** The server logic for handling transactions and user authentication is built with Node.js
    * **Express.js:** A Node.js web application framework is used to provide the frontend with RESTful APIs to communicate with the backend
    * **MongoDB:** A NoSQL database used to store user account information, transaction history, and account data. 
    * **Sambanova AI:** The application is deployed and optimized for performance on Sambanova AI's platform, demonstrating experience with advanced AI hardware and deployment. The model was built on top of OpenAI's GPT model. 

* **Frontend:**
    * **React:** The user interface is built with React, a popular JavaScript library for creating dynamic and interactive web applications.
    * **React Router:** React Router is used for scalable client side routing, allowing for easy navigation between different sections of the application (e.g., account overview, transaction history, profile settings).
    * **Tailwind CSS:** The application's styling is handled with Tailwind CSS, a utility-first CSS framework. This allows for rapid UI development and consistent design.

**Key Features:**

* **User Authentication:** The project uses JSON Web Tokens (JWT) for easy client side authentication and authorization.
* **Account Management:** Users can view their account balances, transaction history, and other related user data
* **Transactions:** The application supports simulated transactions (deposits, withdrawals, and transfers between users)
* **Data Fetching:** React axios is used to fetch data from the Node.js backend through Express.js API calls
* **State Management:** React's built in `useState` is used for managing components state and re-rendering of the user data once the api calls returned the data

**Project Setup and Installation (NEEDS EDITING):**

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url>
    cd personal-banker
    ```

2.  **Set up MongoDB:**
    * Ensure you have MongoDB installed and running.
    * Create a `.env` file in the `backend` directory and add your MongoDB connection string:
        ```
        MONGODB_URI=mongodb://username:password@host:port/database_name
        ```
    * Add OpenAI API Key
        ```
        OPENAI_API_KEY=YOUR_OPENAI_API_KEY
        ```
    * Add Sambanova API Key
        ```
        SAMBANOVA_API_KEY=YOUR_SAMBANOVA_API_KEY
        ```

3.  **Start the Backend Server:**
    ```bash
    nodemon server.js
    ```

4.  **Install  Dependencies:**
    ```bash
    npm install  #or yarn install
    ```

5.  **Start the Frontend Development Server:**
    ```bash
    npm run dev  #or yarn dev
    ```
