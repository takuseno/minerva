import time

from multiprocessing import Process, Queue

RUNNING_PROCESSES = {}


def _child_process(func, queue, args, kwargs):
    ret = func(*args, **kwargs)
    queue.put(ret)


def dispatch(uid, func, *args, **kwargs):
    queue = Queue()
    process = Process(target=_child_process,
                      args=(func, queue, args, kwargs),
                      daemon=True)
    process.start()
    RUNNING_PROCESSES[uid] = (process, queue)


def get(uid):
    _, queue = RUNNING_PROCESSES[uid]
    return queue.get()


def is_running(uid):
    if uid not in RUNNING_PROCESSES:
        return False
    process, _ = RUNNING_PROCESSES[uid]
    return process.is_alive()


def kill(uid):
    if uid not in RUNNING_PROCESSES:
        return
    process, _ = RUNNING_PROCESSES[uid]
    while process.is_alive():
        process.terminate()
        time.sleep(0.1)
