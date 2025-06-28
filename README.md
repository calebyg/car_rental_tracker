🚗 Car Rental Tracker

A full-stack issue tracking application built to streamline internal operations for a car rental company. I designed and developed this project from the ground up with a strong focus on backend architecture, clean API routing, and dynamic frontend interactivity using React.

🔨 Tech Stack

- Frontend: JavaScript, React.js, JSX, CSS

- Backend: Node.js, Express.js, PostgreSQL

- Database: PostgreSQL

- Deployment: Heroku

- Tools: dotenv, nodemon, Fetch API, Postman

📁 Project File Structure

car_rental_tracker/
├── backend/
│ ├── config/
│ │ └── db.js # PostgreSQL pool setup (dotenv + pg)
│ ├── queries/
│ │ └── tickets.js # SQL queries (e.g. insert, update, delete, resolve)
│ ├── routes/
│ │ └── tickets.js # Express routes for ticket operations
│ ├── server.js # Express server entry point
│ ├── package.json # Backend dependencies & scripts
│ └── package-lock.json
│
├── frontend/
│ ├── public/
│ │ └── index.html # HTML entry point
│ ├── src/
│ │ ├── components/ # React components (TicketList, TicketForm, etc.)
│ │ ├── stylesheets/ # CSS files (e.g., TicketForm.css)
│ │ ├── App.js # Main React app component
│ │ └── index.js # React DOM root
│ ├── package.json # Frontend dependencies & scripts
│ └── package-lock.json
