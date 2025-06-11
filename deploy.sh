#!/bin/bash

yarn build-only
rsync -avz -e "ssh -i ~/.ssh/richard" dist/* richard@my.fulafia.edu.ng:/var/www/test/web2