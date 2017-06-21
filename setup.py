from json import loads
from os.path import join, dirname
from src.land_registry_elements.version import Version
import setuptools


def read(filename):
    path = join(dirname(__file__), filename)
    with open(path, 'rt') as file:
        return file.read()


package = loads(read('package.json'))

setuptools.setup(name='land-registry-elements',
                 version=Version(package['version']).number,
                 description='Land Registry Elements',
                 packages=['land_registry_elements'],
                 package_dir={'': 'src'},
                 package_data={'land_registry_elements': ['**/template.html']}
                 )
