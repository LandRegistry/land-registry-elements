import glob
import setuptools
from src.land_registry_elements.version import Version


setuptools.setup(name='land-registry-elements',
                 version=Version('1.0.0').number,
                 description='GOV.UK elements Jinja macros',
                 packages=['land_registry_elements'],
                 package_data={'land_registry_elements': glob.glob('src/land-registry-elements/**/template.html')}
                 )
