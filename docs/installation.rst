******************
Installation Guide
******************

Recommended Platforms
---------------------

Operating System
~~~~~~~~~~~~~~~~

MINERVA is only tested on Linux and macOS.
However, you can possibly run MINERVA on Windows as long as PyTorch runs since
it's the core dependency.

Browser
~~~~~~~

For now, MINERVA is only tested with Chrome. There would be incompatibilities
with other browsers (I've confirmed some glitches on Safari).

Install MINERVA
---------------

Install MINERVA via PyPI
~~~~~~~~~~~~~~~~~~~~~~~~

`pip` is a recommended way to install minerva::

  $ pip install minerva-ui

Install MINERVA from source
~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can also install via GitHub repository::

  $ git clone https://github.com/takuseno/minerva
  $ cd minerva
  $ npm install
  $ npm run build
  $ pip install -e .


Install MINERVA via Docker
--------------------------

If you use GPU devices, you need to setup `nvidia-docker <https://github.com/NVIDIA/nvidia-docker>`_ properly::

  $ docker run -d --gpus all -p 9000:9000 --name minerva takuseno/minerva:latest
  $ # MINERVA server is running
