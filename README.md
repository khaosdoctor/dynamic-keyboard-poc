# Dynamic keyboard proof of concept

> Case 2: The pins are stored in plaintext in the database, permutations are done in the frontend but the mapping comes from the backend and changes for every session

## What is this?

Usually, especially in banks, you have to type a pin in a type of keyboard that looks like this:

![](assets/asset-1699483313.png)

This is a very common practice of preventing keyloggers from stealing your pin since the value in the button and the value in the input don't match as the button have multiple values.

I got curious after seeing [this tweet](https://twitter.com/niagalves/status/1719695627586580728), about how we could implement that, and this was a nice challenge.

# How this case works

In this case, we are running the simplest possible configuration, which is:

1. The pins are stored in plaintext in the database
2. The whole cartesian permutation of the keyboard is done in the frontend
  2.1 The keyboard is always static, having the same mapping for each user

The idea is to have a static keyboard, which means that the mapping of the keyboard is always the same for each user, and the whole cartesian permutation of the keyboard is done in the frontend, which means that the backend only receives the collection of possible pins in plaintext so it can compare with the pins it has stored locally in memory (we have some test users with some pins in the [server file](./src/server.ts)).

# How to run

**Needs Node v20.6.0 or higher**

The project is done as a single front-end and backend application using Vue and Koa. So after cloning the repo and getting to the branch you want to test, you can run the following commands:

```bash
npm install
npm run start:dev
```

The application will run on port 3000, just go to `http://localhost:3000` and see the frontend working.

I'm also sending the `.env` file for reference when required, you can set the `PORT` variable there and other variables that are needed for other cases.
