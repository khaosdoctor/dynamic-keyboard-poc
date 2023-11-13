# Dynamic keyboard proof of concept

> How the hell does this work?

*There's no code in here, jump to one of the branches to see how it works*

## What is this?

Usually, especially in banks, you have to type a pin in a type of keyboard that looks like this:

![](assets/asset-1699483313.png)

This is a very common practice of preventing keyloggers from stealing your pin since the value in the button and the value in the input don't match as the button have multiple values.

I got curious after seeing [this tweet](https://twitter.com/niagalves/status/1719695627586580728), about how we could implement that, and this was a nice challenge.

## Cases

This is the main branch so there's no actual code in here, you can check the other branches to see how it works. But there are two main cases:

1. The pins are stored in plaintext in the database
2. The pins are stored hashed in the database

And for each case we have some other subcases:

1. The whole cartesian permutation of the keyboard is done in the frontend
  1.1 The keyboard is always static, having the same mapping for each user
  1.2 The keyboard is dynamic, which means that the keyboard mapping comes from the backend and changes for every session
2. The whole cartesian permutation of the keyboard is done in the backend
  2.1 The keyboard is always static, having the same mapping for each user
  2.2 The keyboard is dynamic, which means that the keyboard mapping comes from the backend and changes for every session

The idea is to explore these points and see what are the pros and cons of each approach.

Each case has its own branch, so you can check them out and see how they work.

### Further explorations

There are some other things that could be explored, those are wild ideas and might not work so take it with a grain of salt:

- If the password is plain text,
  - it's possible to use a tree-like structure like a [binary tree](https://en.wikipedia.org/wiki/Binary_tree), [radix tree](https://en.wikipedia.org/wiki/Radix_tree), but probably a [trie](https://en.wikipedia.org/wiki/Trie) in the backend to compare the values and reduce the number of comparisons needed to find the correct pin
  - If the pin is fully numeric, it's also possible to sort all the values using [radix sort](https://en.wikipedia.org/wiki/Radix_sort) and use a binary search to find the correct pin, along with almost any other sorting or searching algorithm
- If the password is hashed,
  - It's possible to use a [bloom filter](https://en.wikipedia.org/wiki/Bloom_filter) to try to reduce the number of comparisons needed to find the correct pin
  - It's possible to test [LSH](https://en.wikipedia.org/wiki/Locality-sensitive_hashing) to see if it's possible to reduce the number of comparisons needed to find the correct pin

*what else?*

# How to run

**Needs Node v20.6.0 or higher**

The project is done as a single front-end and backend application using Vue and Koa. So after cloning the repo and getting to the branch you want to test, you can run the following commands:

```bash
npm install
npm run start
```

The application will run on port 3000. I'm also sending the `.env` file for reference, you can set the `PORT` variable there and other variables that are needed for other cases.
