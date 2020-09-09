from setuptools import setup


setup(name="minerva-ui",
      version="0.11",
      description="Out-of-the-box GUI Tool for Data-Driven Deep Reinforcement Learning",
      long_description=open("README.md").read(),
      long_description_content_type="text/markdown",
      url="https://github.com/takuseno/minerva",
      author="Takuma Seno",
      author_email="takuma.seno@gmail.com",
      license="MIT License",
      install_requires=["d3rlpy==0.23",
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
