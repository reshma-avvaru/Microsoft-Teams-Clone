### Microsoft Teams Clone

The project is an attempt to build a replica of the popular video conferencing application - Microsoft Teams. The project was built as a part of the Microsoft Engage Program 2021 by following Agile methodology.

The website is hosted at https://teams-client-892ac.web.app/landing

![landing](https://user-images.githubusercontent.com/69675204/125494972-3ed3115e-0fc0-4f81-8679-16447f02e5af.png)

# Table of contents

- [Features of the Application](#features-of-the-application)
- [SDK Analysis](#sdk-analysis)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Agile Methodology](#usage-of-agile-methodology)
- [The Web Application](#the-web-application)


# Features of the Application

1. User Authentication
2. Group Video Calling
3. Toggle Audio
4. Toggle Video
5. Screen Sharing
6. Toggle between screen and participant videos
7. Select Audio and Video devices
8. Closed rooms with password
9. Record of user meetings
10. Disconnect call
11. Set name of group call
12. Group Chat
13. Use emojis in chat
14. Copy group invitation
15. Participant list

[(Back to top)](#table-of-contents)

# SDK Analysis
As a part of my explorations phase I have analysed the following:
- [WebRTC](#webrtc)
- [PeerJS](#peerjs)
- [Jitsi](#jistsi)
- [Lib-Jitsi](#lib-jitsi)
- [Azure communication services](#azure-communication-services)

## WebRTC

<b>Pros:</b>
-	Platform and device independent
-	Secure audio and video
-	1-1 conection experiences minimal lag
-	Wide community
-	Huge number of demos

<b>Cons:</b>
- Group video needs a 1 to n-1 mesh connections causing huge lag above 4 participants
- Requires setup of STUN and TURN server

## PeerJS

<b>Pros:</b>
-	Provides all the functionality as WebRTC
-	Provides a STUN server
-	Good documentation
	
<b>Cons:</b>
-	Does not provide TURN server.
-	Still requires a  1 to n-1 connection mesh resulting in lag beyond 4 participants

## Jitsi-meet

<b>Pros:</b>
-	End-to end encrypted
-	Provides high quality video
-	Provides Chat and other features using Iframe

<b>Cons:</b>
-	Minimum control over UI and user access.
-	Embedding another application nothing much to learn.

## Lib-jitsi

<b>Pros:</b>
-	Video is end-to-end encrypted
-	Great community 

<b>Cons:</b>
-	Huge repository 
-	Not a trivial task to implement from scratch in limited time frame

## Azure Communication Services

<b>Pros:</b>
-	High quality audio and video
-	Provides chat functionality
-	very clear documentation

<b>Cons:</b>
-	Very small community
-	Video calling SDK not available for python
-	Requires generation and management of access tokens ans user id

I had finally chosen Azure communnication as it provides high quality video, audio and chat functionality.

[(Back to top)](#table-of-contents)

# Tech Stack
-<b>Front-end:</b> Angular
-<b>Back-end:</b> Django
-<b>Database:</b> PostgreSQL

[(Back to top)](#table-of-contents

# Installation
To use this project, follow the steps below:

Initialise git on your terminal.

```bash
git init
```
Clone this repository.

```bash
git clone https://github.com/reshma-avvaru/Microsoft-Teams-Clone.git
``` 

Running client
Change the directory. 

```bash
cd teamsClient
```

Open the repository with your code editor. 
In case you do not have a code editor, it is recommended you use Visual Studio Code. 

```bash
code .
```

Open the terminal in Visual code by pressing Ctrl+J (Windows) and run the following commands:

```bash
npm i
```
After the required packages are installed, run the following command: 

```bash
ng serve
```
Please note: To run the machine on localhost:4200 you will have to add firebaseconfig to the environment 

Running back-end:
Change the directory. 

```bash
cd teamsClient
```
Open the repository with your code editor. 
In case you do not have a code editor, it is recommended you use Visual Studio Code. 

```bash
code .
```
After the required packages are installed, run the following command: 

Creating a virtual environment
- Create a python virtual environment inside the project directory using the command `python3 -m venv env`.
- To activate the environment, run `source env/bin/activate` in **Linux** and `\env\Scripts\activate.bat` in **Windows**.
- To exit the virtual environment, run `deactivate`.

Installing dependencies

```bash
pip install -r req.txt
```
Making migrations

```bash
python3 manage.py makemigrations
```
```bash
python3 manage.py migrate 
```
```bash
python3 manage.py runserver
```
Please note: To run the machine on localhost:8000 you will add the following to your .env
- SECRET_KEY
- CONNECTION_STRING (azure communication services resource connection string)
- END_POINT (azure communication services resource end point)
- DATABASE_URL

# Usage of Agile Methodology 

From the AMA session I had understood that inorder to develop software to meet the high requirements of present market agile methodology is the best practice. Understanding this I have incorporated it into my project
The [ppt](https://drive.google.com/file/d/1rsDnsGo6Ms44HjQD3P7jJ2HnN-U909iw/view?usp=sharing) contains deatils of my sprints.

# The Web Application

I have hosted website using firebase hosting at https://teams-client-892ac.web.app/
I have hosted django REST API on heroku
