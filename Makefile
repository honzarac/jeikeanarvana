build:
	docker build -t voxfpd/ikea:${git describe --tags --abbrev=0} .
push:
	docker push voxfpd/ikea:${git describe --tags --abbrev=0}
