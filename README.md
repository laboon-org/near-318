# Near-318

- NEAR: Bring FUNd to you with a LOT from Bingo 318

## System Guideline

1. [Frontend](/front/README.md)
2. [Backend](/back/README.md)
3. [Contract](/contract/README.md)

## Submission

### A. Project Description

- Name: Near-318
- Description: Bring FUNd to you with a SMART LOT from Bingo-318, Keno, and more
- MVP Link: https://near-318.vercel.app/

#### Inspiration

- Bingo-18: From Vietlot

#### A1 - Video Presentation

- Link: https://youtu.be/dST2zzni_T0

#### A2 - User Manual

##### Guidance

- Roles

> Player: Participants buy lottery tickets.

##### Features

- Wallet Connecting:

> 1. On the Header, click the "Connect wallet" button.
> 2. Select "Connect with NEAR"
> 3. Select the wallet you want to connect to in the list, below the words "Connect your wallet".
> 4. Select the wallet account you want to connect or create a new one.
> 5. The text on the "Connect wallet" button will change to the name of the logged in wallet account.

- Buy Tickets:

> 1. Go to the "Buy Ticket" section on the Header (or press the "Buy Ticket" button on the homepage).
> 2. Pick up the number you want and click the "Order" button.
> 3. Click the "Approve NEAR" button to confirm the money amount of the wallet will be deduced.
> 4. Select the amount you want to bet (smaller than the available amount).
> 5. Click the "Agree" button.
> 6. Sign the transaction and wait for the result.
> 7. In success, the app will redirect to the homepage, and under the "NEXT DRAW" section will display the number of tickets purchased.

- Notice: The time limit for purchasing a ticket per round is less than 1 minute.

- Result validating and get rewards:

> 1. On the homepage, at the "Winning Numbers" section, switch to the "Your History" tab.
> 2. A list of rounds participated with the number of winning tickets will be displayed.
> 3. Press the ">" arrow button to open the details of a joined match.
> 4. If the player has a winning number, click the "Request Prize" button to claim the reward.
> 5. In success, the "Request Prize" button will change to "Claimed".

### B. Inspiration

- Ideally, the lottery must be clear and transparent.
- We bring the Bingo 18 version on the chain.
- Simplify everything and increase the chance get the reward.
- High probability with the combination of 3 numbers of 1-digit one.

### C. What it does

- Players will participate in the spins by choosing their desired number on the screen.
- The results will be generated randomly from "Smart Contract" on Blockchain (NEAR Network)
- Each round will take place within 10 minutes.
- There are 38 different winning and playing modes for players.
- At the end of the game session, the results will be notified and compared.
- Prizes are received almost immediately in the participant's wallet.
- The prize will create each round to share at last among winners.

### D. How we built it

- ReactJS (NextJS Framework)
- Near SDK, API JS, Link: https://docs.near.org/tools/near-sdk-js
- Near Wallet
- Bootstrap with CSS
- Support Responsiveness on Mobile.
- Vercel Hosting for dApp Static Site.
- Mob-X, Redux for State Management.

### E. Challenges we ran into

- The documentation of Smart Contract in JS SDK is quite new, seem lack of material for developers.
- Recognized the limitation of the network for our next idea to reduce rounding time to less than 10 minutes.
- How it could be supported worldwide for massive users using in the future.

### F. Accomplishments that we're proud of

- We are proud to finished creating an innovative dApp LOT on the chain.
- The MVP doesn't get plenty of time, to make it perfect, but it works.

### G. Timeline

- [x] Q1-2023: First Implementation of MVP (Bingo-18)
- [ ] Q4-2023 (Oct)
-> Implement Near BOS
- [ ] Q4-2023 (Nov)
-> Complete 38 modes of Bingo
-> Roll-out to mainnet
- [ ] Q4-2023 (Dec)
-> Support Keno and other LOT
- [ ] Q1-2024:
-> Support Cross-Chain
-> Publish Native Mobile
- [ ] Q2-2024:
-> Support Stable Coin
-> Support Fiat Currency