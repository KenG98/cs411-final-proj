#!/bin/bash
echo "Recommendations:"
OUT="$(python recommend.py ,)"
arrOUT=(${OUT//,/ })
for i in "${arrOUT[@]}"
do
    curl -s "http://www.omdbapi.com/?i=${i}&apikey=83dd260b" | python -c "import sys, json; print(json.load(sys.stdin)['Title'])"
done
