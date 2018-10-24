#!/bin/sh
cd ./ios

if [ -r Podfile ] ; then
  pod install
fi
