#!/bin/zsh
ls -d **/*.go | entr -s "pkill server; echo '***start***'; go build; echo '***end***'"
