<div align="center"><img src="assets/logo.jpg" width="800"/></div>

# MINERVA: Out-of-the-box GUI Tool for Data-Driven Deep Reinforcement Learning
![test](https://github.com/takuseno/minerva/workflows/test/badge.svg)
![format check](https://github.com/takuseno/minerva/workflows/format%20check/badge.svg)

MINERVA is an Out-of-the-box GUI Tool for Data-Driven Deep Reinforcement
Learning, designed for everyone including non-programmers to do reinforcement
learning as a tool.

The powerful reinforcement learning algorithms are provided by
[d3rlpy](https://github.com/takuseno/d3rlpy) which enables users to achieve
great performance potentially beyond the existing papers.

## installation
```
$ pip install minerva
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
