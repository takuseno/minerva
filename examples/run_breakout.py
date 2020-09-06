import numpy as np
import torch
import d4rl_atari
import gym

# load policy function only with PyTorch dependency
policy = torch.jit.load('policy.pt')

# get the wrapped atari environment
_, env = gym.make('breakout-mixed-v0')


# make frame stacking helper
class StackedObservation:
    def __init__(self, observation_shape, n_frames):
        self.image_channels = observation_shape[0]
        image_size = observation_shape[1:]
        self.n_frames = n_frames
        stacked_shape = (self.image_channels * n_frames, *image_size)
        self.stack = np.zeros(stacked_shape, dtype=np.uint8)

    def append(self, image):
        self.stack = np.roll(self.stack, -self.image_channels, axis=0)
        self.stack[self.image_channels * (self.n_frames - 1):] = image.copy()

    def eval(self):
        return self.stack

    def clear(self):
        self.stack.fill(0)


# stacking 4 frames
stack = StackedObservation(env.observation_space.shape, 4)

# evaluation loop
while True:
    observation = env.reset()
    while True:
        # take action
        stack.append(observation)
        action = policy(torch.tensor([stack.eval()], dtype=torch.uint8))[0]

        # render
        env.render()

        # get next observation
        observation, _, terminal, _ = env.step(action.cpu().numpy())

        if terminal:
            stack.clear()
            break
