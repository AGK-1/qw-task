# Welcome to My Basecamp 1
***

## Task
The problem was to create a functional project management dashboard inspired by Basecamp's user interface. The challenge lied in implementing a dynamic tracking system where the progress of a project is automatically calculated based on the completion of its sub-tasks, while ensuring a secure multi-user environment where data is persisted per session.

## Description
I solved this problem by developing a Fullstack web application using **Node.js, Express, and EJS**. 
* **Backend Logic:** I structured the data models so each project contains an array of tasks. I implemented a custom progress calculation logic:
    $$\text{progress} = \left( \frac{\text{completed\_tasks}}{\text{total\_tasks}} \right) \times 100$$
* **User Authentication:** Integrated `express-session` and `bcryptjs` for secure password hashing and user-specific project views.
* **Dynamic UI:** Developed a responsive grid layout using CSS. I utilized EJS templates to render real-time progress bars that update visually as users toggle task completion statuses.
* **Compatibility:** Refactored the code to use standard JavaScript syntax compatible with various Node.js environments (removing optional chaining for better stability).

## Installation
To get this project running locally, ensure you have Node.js installed, then follow these steps:

1. Clone the repository to your local machine.
2. Install the necessary dependencies:
```bash
npm install express express-session bcryptjs ejs
```

## Usage
```
node server.js
Open your browser and navigate to http://localhost:3000.

Register a new account to become the owner of your projects.

Create a new project from the dashboard.

Click on the project title to add specific tasks.

Toggle the checkboxes next to tasks to see the progress bar update on the main dashboard.

```
### The Core Team


<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
