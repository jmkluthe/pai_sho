
all:
	pip install -r requirements.txt

launch:
	python launch.py

app:
	python launch_app.py

api:
	python launch_api.py

freeze:
	pip freeze | grep -v "pkg-resources" > requirements.txt
