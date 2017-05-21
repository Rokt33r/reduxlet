# Reduxlet

[![Build Status](https://travis-ci.org/Rokt33r/reduxlet.svg?branch=master)](https://travis-ci.org/Rokt33r/reduxlet)

A small container component with an isolated Redux store.

## Intro

**Manage state of a component just like redux!**

Reduxlet create a redux store, which is context-free, for a single container component.
Let's use `actions` and `reducer` instead of using `this.setState`!

Also, lots of sugar is inside by default. Binding actions to dispatch, composing enhancers and applying middleware become much easier!

## Who needs Reduxlet?

Who want to make a **VERY POWERFUL** component.

- Who needs **very strict state control**
- Who needs **saga** for a React Component

![Reduxlet in the real world](./resources/reduxlet-realworld.gif)

## Packages

This is a monorepo. To find more information, please check the following links!

- [Reduxlet](packages/reduxlet/readme.md) : Reduxlet core library.
- [Reduxlet Saga](packages/reduxlet-saga/readme.md) : Reduxlet with Redux Saga support. This is a superset of [Reduxlet](packages/reduxlet/readme.md) core library.
