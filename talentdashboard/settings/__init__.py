import os

ENV_VARS_FILENAME = '.env'


def load_local_env_vars(project_root):
    """Imports some environment variables from a special .env file in the
    project root directory.

    """
    if len(project_root) > 0 and project_root[-1] != '/':
        project_root += '/'
    try:
        envfile_name = project_root+ENV_VARS_FILENAME
        envfile = file(envfile_name)
    except IOError:
        print "The file {0} was not found. Were you expecting me to load environment variables from it?".format(envfile_name)
        return

    print "Loading environment variables from: {0}".format(envfile_name)
    for line in envfile.readlines():
        [key, value] = line.strip().split("=")
        print "Loaded: {0}".format(key)
        os.environ[key] = value
