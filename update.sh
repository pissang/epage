#!/bin/sh
cd ../qpf/build
node r.js -o config.js
cp ../dist/qpf.js ../../epage/static/lib/qpf.js

cp ../src/components/less/base.less ../../epage/static/style/qpf/base.less
# cp -r ../src/components/less/images ../../emage/example/static/style/qpf/images