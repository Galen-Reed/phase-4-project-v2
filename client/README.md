# Ticketing System

A full-stack web application that allows users to manage devices and submit tickets to those devices. Each user has a private view of their own tickets and can intereact with a shared device inventory.

## Features

-  User authentication (Sign up / Log in / Log out)
-  View a list of all devices in the system
-  Add new devices to the inventory
-  Create, edit, and delete support tickets for any device
-  Tickets are user-specific — each user can only view or manage their own tickets

## Installation & Setup

1. Clone this repository:
`git clone https://github.com/Galen-Reed/phase-4-project-v2`
`cd phase-4-project-v2`

2. Backend Setup (Flask)
`cd server`
`pip install -r requirements.txt`
`flask db init`
`flask db migrate -m "initial migration"`
`flask db upgrade`
`python app.py`

3. Frontend Setup (React)
`cd client`
`npm install`
`npm start`

## Contributing
Contributions, issues, and feature requests are welcome! Feel free to fork the repository and submit pull requests.

## License 
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).