DEPLOY_DIR=./package

prepare-package:
	if [ ! -d "${DEPLOY_DIR}" ]; then mkdir "${DEPLOY_DIR}"; fi
	$(eval VENV = $(shell pipenv --venv))
	cp -r ${VENV}/lib/python3.7/site-packages/* ${DEPLOY_DIR}/
	cp -r app/* ${DEPLOY_DIR}/

clean-package:
	rm -rf ${DEPLOY_DIR}/*
