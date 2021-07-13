### Microsoft Teams Clone

The project is an attempt to build a replica of the popular video conferencing application - Microsoft Teams. The project was built as a part of the Microsoft Engage Program 2021 by following Agile methodology.

The website is hosted at https://teams-client-892ac.web.app/landing

![landing](https://user-images.githubusercontent.com/69675204/125494972-3ed3115e-0fc0-4f81-8679-16447f02e5af.png)

# Table of contents

- [Features of the Application](#features-of-the-application)
- [SDK Analysis](#sdk-analysis)
- [Tech Stack Selection](#tech-stack-selection)
- [Installation](#installation)
- [Agile Methodology](#usage-of-agile-methodology)
- [Challenges Faced](#challenges-faced)
- [The Web Application](#try-the-web-application)
- [Future Scope](#future-scope)
- [Support and Contact](#support-and-contact)


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

I had finally chosen Azure communnication because of it provides high quality video, audio and chat functionality.




