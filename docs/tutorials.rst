*********
Tutorials
*********

CartPole
--------

Download dataset
~~~~~~~~~~~~~~~~

First of all, download the cartpole dataset as follows::

  $ wget https://www.dropbox.com/s/vc7fm7qdnu0kh01/cartpole.csv?dl=1 -O cartpole.csv

Train
~~~~~

Follow instruction from :ref:`upload_dataset` to :ref:`start_training`.

Deploy
~~~~~~

Finally, you can download the trained policy as :ref:`export_policy_function`.

You can load the policy only with two lines of codes.

.. code-block:: python

  import torch

  policy = torch.jit.load('policy')

It's easy, right?

Then you can write the rest of interaction codes as usual.

.. code-block:: python


  import gym

  env = gym.make('CartPole-v0')

  observation = env.reset()

  while True:
      # feed observation to the policy
      action = policy(torch.tensor([observation], dtype=torch.float32))

      # take action to get next observation
      observation, _, done, _ = env.step(action[0].numpy())

      # rendering environment
      env.render()

      # break if the episode reaches the termination
      if done:
          break
