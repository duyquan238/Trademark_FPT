if [ $1 = "start" ]
	then 
		npx serve -s build
elif [ $1 = "build" ] ; then
    echo "-Build"
	npm run build
    echo "-Done"
fi;