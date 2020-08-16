import torch
import gym

# load policy function only with PyTorch dependency
policy = torch.jit.load('policy.pt')

# make environment
env = gym.make('CartPole-v0')

# evaluation loop
while True:
    observation = env.reset()
    while True:
        # take action
        action = policy(torch.tensor([observation], dtype=torch.float32))[0]

        # render
        env.render()

        # get next observation
        observation, _, terminal, _ = env.step(action.cpu().numpy())

        if terminal:
            break
