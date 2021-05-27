build:
	$(eval GIT_TAG=$(shell git describe --tags --abbrev=0))
	docker build -t voxfpd/ikea:${GIT_TAG} .
push:
	$(eval GIT_TAG=$(shell git describe --tags --abbrev=0))
	docker push voxfpd/ikea:${GIT_TAG}
