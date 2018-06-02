from subprocess import call


call(['gnome-terminal', '-x', 'python', 'launch_app.py'])
call(['gnome-terminal', '-x', 'python', 'launch_api.py'])

