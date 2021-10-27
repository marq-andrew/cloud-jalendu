#!/bin/bash

days=$(date +%s --date="-3 days")

for file in ./logs/jalendu-*.log; do
    fdate=${file:15:8}
    fsec=$(date +%s --date=${fdate/.log/})
    if [[ $fsec -lt $days ]]; then
        rm $file
    fi
done
