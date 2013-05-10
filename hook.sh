#!/bin/bash
if [ -f attask.conf ]; then
	source attask.conf
fi

todosFile=`mktemp "${TMPDIR}attaskhook.XXXXX"`

git diff HEAD^ HEAD | grep --color=never -E "^\+.*TODO:" | grep --color=never -oE "//TODO:\s*.*" | sed "s-//TODO:--" > ${todosFile}

unset PARAMETERS i
while read LINE; do
	ESCAPED=`echo $LINE | sed 's/"/\\\\"/g'`
	PARAMETERS[i++]="{\"name\":\"${ESCAPED}\",\"description\":\"Created by git\"}"
done < ${todosFile}

./attask-todo.js "${ATTASK_USERNAME}" "${ATTASK_PASSWORD}" "${PARAMETERS[@]}"

rm ${todosFile}
