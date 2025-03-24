# Project Setup and Installation Guide

This document outlines the steps necessary to set up and run the frontend, backend, and model API for this project.

## Prerequisites

Before you begin, make sure you have the following installed:

*   **Node.js and npm:** (for the frontend and backend) - Download from [https://nodejs.org/](https://nodejs.org/)
*   **Python:** (for the model API) - Download from [https://www.python.org/downloads/](https://www.python.org/downloads/)
*   **pip:** (Python's package installer, usually comes with Python)
*   **uvicorn:** (ASGI server for the model API, will be installed later)

## Important: .env Files

This project requires `.env` files for proper configuration. These files contain sensitive information that should not be publicly shared.

**Please email me at `bombhu15@gmail.com` to request the necessary `.env` files.**

Once you receive the `.env` files, make sure to place them in the correct directories:
*   **`.env` for the frontend:** Place it in the `/frontend` directory
*   **`.env` for the backend:** Place it in the `/backend` directory
*   **`.env` for the model API:** Place it in the `/model/model_api` directory

## Installation Steps

Follow these steps to install and run the different parts of the project:

### 1. Frontend Setup

1.  **Navigate to the Frontend Directory:** Open your terminal or command prompt and navigate to the frontend folder:

    ```bash
    cd frontend
    ```

2.  **Install Dependencies:** Use `npm` to install all the required packages:

    ```bash
    npm i
    ```
    or 
      ```bash
    npm install
    ```


3.  **Start the Development Server:**  Run the development server to launch the frontend:

    ```bash
    npm run dev
    ```

    This will typically start the frontend application in your browser, usually at `http://localhost:5173` (or similar, as specified in the terminal output).

### 2. Backend Setup

1.  **Navigate to the Backend Directory:** Open a new terminal or command prompt and navigate to the backend folder:

    ```bash
    cd backend
    ```

2.  **Install Dependencies:** Use `npm` to install all the required packages:
    ```bash
     npm i
    ```
    or 
    ```bash
      npm install
    ```

3. **Start the Development Server:** Run the development server to launch the backend:

    ```bash
    npm run dev
    ```
    The backend typically runs on a different port, often `http://localhost:3000` or `http://localhost:8080` (check the terminal output).

### 3. Model API Setup

1.  **Navigate to the Model API Directory:** Open another terminal or command prompt and navigate to the model API folder:

    ```bash
    cd model/model_api
    ```
     or 
    ```bash
      cd model\model_api
    ```


2.  **Install Python Dependencies:** Install the required Python packages using `pip`. You may need to create a virtual environment for Python best practice
     
    ```bash
      pip install -r requirements.txt
    ```

3. **Run the API:** Start the model API with uvicorn:

    ```bash
    uvicorn main:app --reload
    ```
     This will start the API on a server, usually at `http://localhost:8000`.

## Running the Application

Once you have completed all the steps above, your frontend, backend, and model API should be running. You should be able to access the full application through your browser via the address where the frontend is running

## Important Notes

*   **Port Conflicts:** If you encounter issues with ports already in use, check the specific configuration files for each part of the project (`package.json` for the frontend and backend, and the specific API for the model API) to modify the default ports, or try to stop those existing processes using the port.
*   **Specific Instructions:** This README gives a general setup. The project may have specific instructions in the project files or elsewhere that would override these.
*   **Error Handling:** If you encounter errors during installation or running the applications, make sure to read the output in the terminal carefully. Google for common errors or consult with other developers for assistance.
*   **Environment Variables:** Make sure you set up any environment variables that might be needed before running the application.


## Troubleshooting
1. Check the terminal for any errors or warnings. Usually they tell you the issue with the setup, installation or during the running of the applications.
2. Make sure you have installed the proper prerequisites as listed in the document.
3. Ports conflicts can be a problem, check which ports the application are using and make sure they are not already in use.
4. If something does not seem right you can restart the server or try to re-install the applications.

That's it! You should be up and running. If you have any further questions, feel free to ask.
