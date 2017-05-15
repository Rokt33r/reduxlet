# Reduxlet Saga

Reduxlet with Redux Saga support.

## Usage

Install via npm.

```sh
npm install reduxlet-saga
```

## API

### `reduxletSaga(params: ReduxletSagaParams)(ReactComponent)`

- `params.saga` : A generator function as a saga task, `function *`. If you want run multiple saga, use `fork` effect! The saga task will be excuted after component mounting and will be cancelled before component unmounting.

Other params are explained by Reduxlet document. Check the following link! [ReduxletParams](https://github.com/Rokt33r/reduxlet/blob/master/packages/reduxlet/readme.md#reduxletparams-reduxletparamstargetcomponent)

#### About external store

Reduxlet Saga doesn't support external saga. `params.saga` will be ignored if you provide external store.

## Contribution

I'm not good at English. If you find some weired expression or typos, feel free to create an issue.

## License

ISC, Junyoung Choi 2017.
