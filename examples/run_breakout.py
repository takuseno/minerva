import numpy as np
import torch
import d4rl_atari
import gym

from collections import deque

# load policy function only with PyTorch dependency
policy = torch.jit.load('policy.pt')

# get the wrapped atari environment
_, env = gym.make('breakout-mixed-v0')

# evaluation loop
while True:
    # stacking 4 frames
    stack = deque(np.zeros((4, 84, 84), dtype=np.uint8).tolist(), maxlen=4)
    observation = env.reset()
    while True:
        # stack frame
        stack.append(observation)
        # take action
        action = policy(torch.tensor([list(stack)], dtype=torch.uint8))[0]

        # render
        env.render()

        # get next observation
        observation, _, terminal, _ = env.step(action.cpu().numpy())

        if terminal:
            break
