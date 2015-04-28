import os

ENV_VARS_FILENAME = '.env'
ENV_TEMPLATE_FILENAME = '.env.requirements'


class MissingEnvironmentVariableError(Exception):
    pass


def _load_dict_from_file(file_name):
    in_file = file(file_name)
    out_dict = {}
    for line in in_file.readlines():
        line = line.strip()
        if line.startswith('#') or len(line) == 0:
            continue
        [key, value] = line.strip().split("=")
        out_dict[key] = value
    return out_dict


def load_local_env_vars(env_dir):
    local_env_variables = {}
    required_env_variables = {}

    if len(env_dir) > 0 and env_dir[-1] != '/':
        env_dir += '/'

    local_env_file_name = env_dir + ENV_VARS_FILENAME
    env_template_file_name = env_dir + ENV_TEMPLATE_FILENAME

    try:
        local_env_variables = _load_dict_from_file(local_env_file_name)
    except IOError:
        print "The file {0} was not found. Were you expecting me to load environment variables from it?".format(local_env_file_name)
        return

    try:
        required_env_variables = _load_dict_from_file(env_template_file_name)
    except IOError:
        print "The template file {0} was not found. I can't validate your local environment variables without it.".format(env_template_file_name)

    for key in required_env_variables:
        if not key in local_env_variables and not key in os.environ:
            raise MissingEnvironmentVariableError(key)

    print "Loading environment variables from {0}:".format(local_env_file_name)
    for key in local_env_variables:
        os.environ[key] = local_env_variables[key]
        print "Loaded: {0}".format(key)
