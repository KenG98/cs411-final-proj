#!/bin/bash
echo "Recommendations for Inception:"
OUT="$(python recommend.py tt5295894)"
arrOUT=(${OUT//,/ })
for i in "${arrOUT[@]}"
do
    curl -s "http://www.omdbapi.com/?i=${i}&apikey=83dd260b" | python -c "import sys, json; print(json.load(sys.stdin)['Title'])"
done
