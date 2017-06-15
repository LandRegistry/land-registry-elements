import glob
import setuptools
from src.land_registry_elements.version import Version


setuptools.setup(name='land-registry-elements',
                 version=Version('1.0.0').number,
                 description='Land Registry Elements',
                 packages=['land_registry_elements'],
                 package_data={'land_registry_elements': glob.glob('src/land_registry_elements/**/template.html')}
                 )
