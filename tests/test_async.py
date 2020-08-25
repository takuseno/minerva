import time
import numpy as np

from minerva.async import dispatch, get, is_running, kill


def test_dispatch():
    def _func(a, b):
        return a + b

    uid = np.random.random()
    dispatch(uid, _func, 1, 2)

    assert get(uid) == 3


def test_is_running():
    def _func():
        time.sleep(0.1)

    uid = np.random.random()
    dispatch(uid, _func)

    assert is_running(uid)


def test_kill():
    def _func():
        time.sleep(1.0)

    uid = np.random.random()
    dispatch(uid, _func)

    kill(uid)
    time.sleep(0.1)
    assert not is_running(uid)
