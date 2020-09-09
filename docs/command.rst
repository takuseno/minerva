***********
MINERVA CLI
***********


run
---

Run the MINERVA server. To stop, press ``Ctrl+C`` on the console::

  $ minerva run

* ``--host`` or ``-h``: (optional) set host name (``0.0.0.0`` by default).
* ``--port`` or ``-p``: (optional) set port number (``9000`` by default).


clean
-----

Clean all data including the database, the training metrics, and trained parameters::

  $ minerva clean


upgrade-db
----------

Upgrade database based on the latest schema definitions.
This command should be called after version updates::

  $ minerva upgrade-db


downgrade-db
------------

Downgrade database to the previous revision::

  $ minerva downgrade-db
