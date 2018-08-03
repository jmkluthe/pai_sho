
all:
	python launch.py

freeze:
	pip freeze | grep -v "pkg-resources" > requirements.txt
