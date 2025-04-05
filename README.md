## How to Run the Project Locally

1. **Clone the repository and navigate into the project directory**  
   ```bash
   git clone <your-repo-url>
   cd KUHACK25

	2.	Switch to the correct branch

git checkout Eric


	3.	Open two terminal windows
	4.	In Terminal 1: Start the Backend Server

cd backend
npm install
node index.js

This will start the backend server on port 4000.

	5.	In Terminal 2: Start the Mobile App (Frontend)

cd TransparentCare
npm install
npx expo start --tunnel

This will launch the Expo Developer Tools in your browser.

	6.	Scan the QR Code
Use the Expo Go app on your phone to scan the QR code from the Expo Developer Tools and launch the app.
	7.	Requirements
	•	Node.js and npm installed on your machine
	•	Expo Go app installed on your iOS or Android device

