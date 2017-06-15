import setuptools
from src.land_registry_elements.version import Version


setuptools.setup(name='land-registry-elements',
                 version=Version('1.0.3').number,
                 description='Land Registry Elements',
                 packages=['land_registry_elements'],
                 package_dir={'': 'src'},
                 package_data={'src.land_registry_elements': ['src/land_registry_elements/**/template.html']}
                 )
