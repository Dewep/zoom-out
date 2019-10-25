#!/bin/sh

ZOOM_OUT_HOST=${HOST:-"http://127.0.0.1:3000"}
ZOOM_OUT_APIKEY=${APIKEY:-"drpanda-key"}
ZOOM_OUT_MODEL=$1

if [ -z "${ZOOM_OUT_MODEL}" ]; then
    (>&2 echo "Usage: ZOOM_OUT_HOST=http://127.0.0.1:3000 ZOOM_OUT_APIKEY=drpanda-key sh replay.sh <model-name>")
    exit 1
fi

echo $ZOOM_OUT_HOST
echo $ZOOM_OUT_APIKEY
echo $ZOOM_OUT_MODEL

for filename in $(dirname $0)/*.${ZOOM_OUT_MODEL}.log; do
    echo "#### " "$filename"
    while IFS='' read -r line || [[ -n "$line" ]]; do
        EVENT=$(echo -n "$line" | base64 -di)
        curl -sS -XPOST "$ZOOM_OUT_HOST/api/models/$ZOOM_OUT_MODEL/push/migrate?archive=0" -H "Authorization: $ZOOM_OUT_APIKEY" -H 'Content-type: application/json' "-d$EVENT"
        echo
        #sleep 0.2
    done < "$filename"
done

for filename in $(dirname $0)/*.${ZOOM_OUT_MODEL}.log.gz; do
    echo "#### " "$filename"
    zcat "$filename" | while IFS='' read -r line || [[ -n "$line" ]]; do
        EVENT=$(echo -n "$line" | base64 -di)
        curl -sS -XPOST "$ZOOM_OUT_HOST/api/models/$ZOOM_OUT_MODEL/push/migrate?archive=0" -H "Authorization: $ZOOM_OUT_APIKEY" -H 'Content-type: application/json' "-d$EVENT"
        echo
        #sleep 0.2
    done
done
