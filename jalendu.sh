#!/bin/bash

find ./logs -mindepth 1 -mtime +7 -delete

LOG=jalendu-$(date +%Y%m%d).log

TS=$(date +%Y%m%d-%H%M%S)

echo 'RESTART' $TS

echo 'RESTART' $TS >> ./logs/restarts.log;

echo >> ./logs/$LOG
echo >> ./logs/$LOG
echo '*+*+*+*+*+*+*+*+*+*+*+*+*+*+*' >> ./logs/$LOG
echo >> ./logs/$LOG
echo 'RESTART' $TS >> ./logs/$LOG
echo >> ./logs/$LOG
echo '*+*+*+*+*+*+*+*+*+*+*+*+*+*+*' >> ./logs/$LOG
echo >> ./logs/$LOG
echo >> ./logs/$LOG

#node deploy-commands.js >> ./logs/$LOG 2>&1

node jalendu.js >> ./logs/$LOG 2>&1
