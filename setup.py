import os

from setuptools import setup


# get __version__ variable
here = os.path.abspath(os.path.dirname(__file__))
exec(open(os.path.join(here, 'minerva', '_version.py')).read())

setup(name="minerva-ui",
      version=__version__,
      description="An out-of-the-box GUI tool for data-driven deep reinforcement learning",
      long_description=open("README.md").read(),
      long_description_content_type="text/markdown",
      url="https://github.com/takuseno/minerva",
      author="Takuma Seno",
      author_email="takuma.seno@gmail.com",
      license="MIT License",
      classifiers=["Development Status :: 4 - Beta",
                   "Intended Audience :: Developers",
                   "Intended Audience :: Education",
                   "Intended Audience :: Science/Research",
                   "Topic :: Scientific/Engineering",
                   "Topic :: Scientific/Engineering :: Artificial Intelligence",
                   "Programming Language :: Python :: 3.6",
                   "Programming Language :: Python :: 3.7",
                   "Programming Language :: Python :: 3.8",
                   "Programming Language :: Python :: Implementation :: CPython",
                   "Operating System :: POSIX :: Linux",
                   "Operating System :: MacOS :: MacOS X"],
      install_requires=["d3rlpy==0.70",
                        "Flask",
                        "flask_sqlalchemy",
                        "flask-marshmallow",
                        "Flask-Migrate",
                        "SQLAlchemy",
                        "marshmallow-sqlalchemy",
                        "click",
                        "Pillow"],
      packages=["minerva",
                "minerva.controllers",
                "minerva.models"],
      package_data={'minerva': ['dist/*']},
      python_requires=">=3.5.0",
      include_package_data=True,
      entry_points={'console_scripts': ['minerva=minerva.index:cli']})
