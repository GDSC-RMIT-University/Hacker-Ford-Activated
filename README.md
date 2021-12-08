# Hacker-Ford-Activated

A daring and creative bot who helps students smoothly hack away at hackathons!

![](image.png)

P.S When Aster feels like they're up for a challenge, they go by the name Hacker Ford 😈

Image by the fabulously talented Isaac Chuah Yi Jie.
Concept design by the ever creative Chaamudi Kodikara.

### Main Features
1. Send announcements and reminders of the mini-events/games and updates on the hacking timeline;
2. Booking system for mentoring sessions on discord voice channels;
3. Helpful slash commands to get information, help and findout what the next mini-event/game is;

### Set up

1. Follow the instructions on [discord](https://discord.js.org/#/) for more details on bots
2. Follow instructions on the AWS console guide in the connect section of your EC2 instance
3. Run the following commands in EC2

    ```
   // install git
   // install npm 
    git clone <repo name>
    cd <git repo name>
    npm i
    npm install -g forever

    forever start --uid hacker-ford index.js
    forever list
    forever stop hacker-ford
   
    // Restart
    git pull
    forever start --uid hacker-ford index.js
   ```
