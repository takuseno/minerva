***************
Getting Started
***************

Prepare Datasets
----------------

Dataset with vector observation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The dataset must be a CSV file containing the following columns.

.. list-table:: columns
   :header-rows: 1

   * - column name
     - description
   * - episode
     - an episode ID
   * - observation:X
     - a real value for the Xth dimension in an observation
   * - action:X
     - a real value for the Xth dimension in an action (continuous control) or an action ID (discrete control)
   * - reward
     - a real value for reward

This is an example CartPole data::

  episode,observation:0,observation:1,observation:2,observation:3,action:0,reward
  0.0,0.03197332076282214,0.023978136772313002,-0.01460231690901137,0.01428123941035453,1,0.0
  0.0,0.0324528834982684,0.21930642661209865,-0.01431669212080428,-0.28297288746447075,0,1.0
  .
  .
  .


Dataset with image observation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

TODO.

Start Server
------------

At the first launch, ``$HOME/.minerva`` will be created to store datasets, databases and training metrics.
You can configure this by setting ``$MINERVA_DIR``.
For example::

  $ export MINERVA_DIR=$HOME/.custom_dir

Now you can start MINERVA as follows::

  $ minerva run [--host HOST_NAME] [--port PORT]

Then, open http://localhost:9000 and you'll see the MINERVA UI.

.. image:: ./assets/startup.jpg

.. _upload_dataset:

Upload Dataset
--------------

Create Project
--------------

.. _start_training:

Start Training
--------------

.. _export_policy_function:

Export Policy Function
----------------------
