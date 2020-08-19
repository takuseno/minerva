<div align="center"><img src="assets/logo.jpg" width="800"/></div>

# MINERVA: An out-of-the-box GUI tool for data-driven deep reinforcement learning
![test](https://github.com/takuseno/minerva/workflows/test/badge.svg)
![format check](https://github.com/takuseno/minerva/workflows/format%20check/badge.svg)
![MIT](https://img.shields.io/badge/license-MIT-blue)

MINERVA is an Out-of-the-box GUI Tool for Data-Driven Deep Reinforcement
Learning, designed for everyone including non-programmers to do reinforcement
learning as a tool.

<div align="center"><img src="assets/screenshot1.jpg" width="800"/></div>

## key features
### :zap: All You Need Is Dataset
MINERVA only requires datasets to start data-driven deep reinforcement learning.

### :beginner: Intuitive GUI
MINERVA provides intuitive GUI to let any users leverage extremely powerful algorithms.

### :rocket: Powerful Algorithm
MINERVA is powered by [d3rlpy](https://github.com/takuseno/d3rlpy) to provide
extremely powerful algorithms in an out-of-the-box way.
The trained policy can be exported as [TorchScript](https://pytorch.org/docs/stable/jit.html).

## installation
```
$ pip install minerva
```

## usage
### run server
At the first time, `~/.minerva` will be automatically created to store
database, uploaded datasets and training metrics.
```
$ minerva run
```
You can change the host and port with `--host` and `--port` arguments
respectively.


### delete data
You can delete entire data (`~/.minerva`) as follows:
```
$ minerva clean
```

## contributions
### build
```
$ npm install
$ npm run build
```

### coding style
This repository is fully formatted with [yapf](https://github.com/google/yapf)
and [standard](https://github.com/standard/standard).
You can format the entire scripts as follows:
```
$ ./scripts/format
```

### test
The unit tests are provided as much as possible.
This repository is using `pytest-cov` instead of `pytest`.
You can run the entire tests as follows:
```
$ ./scripts/test
```
