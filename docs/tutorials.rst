*********
Tutorials
*********

CartPole
--------

Download dataset
~~~~~~~~~~~~~~~~

First of all, download the cartpole dataset as follows::

  $ wget https://www.dropbox.com/s/vc7fm7qdnu0kh01/cartpole.csv?dl=1 -O cartpole.csv

Or access to https://www.dropbox.com/s/vc7fm7qdnu0kh01/cartpole.csv .

Train
~~~~~

Follow instruction from :ref:`upload_dataset` to :ref:`start_training`.

Deploy
~~~~~~

Finally, you can download the trained policy as :ref:`export_policy_function`.
At this time, you have two options of the model format, TorchScript and ONNX.

TorchScript
***********

You can load the policy in two lines of codes only with PyTorch.

.. code-block:: python

  import torch

  policy = torch.jit.load('policy.pt')

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

ONNX
****

In this tutorial, `onnxruntime <https://github.com/microsoft/onnxruntime>`_ is
used to load the model.

.. code-block:: python

  import onnxruntime as ort

  ort_session = ort.InferenceSession('policy.onnx')

Basically, ONNX is also easy to load.

Then you can write the rest of interaction codes like above.

.. code-block:: python

  import gym

  env = gym.make('CartPole-v0')

  observation = env.reset()

  while True:
      # change dtype strictly to float32 and expand its shape
      observation = observation.astype('f4').reshape((1, -1))

      # feed observation to the policy
      action = ort_session.run(None, {'input_0': observation})[0]

      # take action to get next observation
      observation, _, done, _ = env.step(action[0])

      # rendering environment
      env.render()

      # break if the episode reaches the termination
      if done:
          break
