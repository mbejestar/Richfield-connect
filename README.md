<img width="1867" height="807" alt="image" src="https://github.com/user-attachments/assets/0bf35557-e274-4e3e-9927-b17253846c84" />



EnrichHub 🚀
EnrichHub is a professional networking and career-development platform built for the Richfield/AAA community. It connects students, alumni, lecturers, recruiters, and industry partners in one platform to support professional networking, career opportunities, skills development, and graduate employability.
✨ Features
👤 Professional student and alumni profiles
🤝 Professional networking and connections
💼 Job, internship and graduate opportunities
🎓 Alumni career pathway exploration
🤖 AI-powered profile assistant
📄 AI-assisted CV and profile building
🔎 Smart job matching
💬 Messaging and social feed
🔔 Real-time notifications
📊 Role-based analytics dashboards
🛡️ Administrator management and moderation
🛠️ Tech Stack
Frontend
React
TypeScript
Vite
Backend
Django
Django REST Framework
AI
Google Gemini API
Database
PostgreSQL / [your database]
📋 Prerequisites
Node.js
npm
Python
Django
Git
⚙️ Installation
1. Clone the repository
git clone https://github.com/mbejestar/Richfield-connect.git
cd Richfield-connect

2. Install dependencies
npm install

3. Configure the Gemini API
Create a .env.local file in the project root:
GEMINI_API_KEY=your_gemini_api_key

4. Start the frontend
npm run dev

5. Start the Django backend
From the Django backend directory:
python manage.py runserver

🔐 Environment Variables
Do not commit API keys or sensitive credentials to GitHub.
GEMINI_API_KEY=your_gemini_api_key

🎯 Project Purpose
EnrichHub was developed for the Richfield Hackathon to address graduate employability by creating a digital professional community where students can build their portfolios, connect with industry, discover opportunities, and continue networking as alumni.
👥 User Roles
Student — Build a professional profile, network and find opportunities.
Alumni — Share career experience and connect with the Richfield community.
Lecturer — Support students, share professional knowledge, provide recommendations and engage with the Richfield community.
Business — Discover talent and publish opportunities.
Administrator — Manage users, content, opportunities and platform analytics.


1. Create the Django Backend

From the project root:

django-admin startproject config .

Create the required Django applications:

python manage.py startapp accounts
python manage.py startapp opportunities
python manage.py startapp connections
python manage.py startapp notifications
2. Create a Virtual Environment
python -m venv venv

Activate it on Windows:

venv\Scripts\activate
3. Install Django Dependencies
python -m pip install "Django>=5.0" djangorestframework django-cors-headers psycopg2-binary python-dotenv djangorestframework-simplejwt

Verify Django:

python -m django --version
4. Create requirements.txt

Create a file called:

requirements.txt

Add:

Django>=5.0
djangorestframework
django-cors-headers
psycopg2-binary
python-dot

EnrichHub — Connecting Talent, Opportunity & Community.

