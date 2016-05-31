from tenant_schemas.management.commands import BaseTenantCommand


class Command(BaseTenantCommand):
    COMMAND_NAME = 'seed_score_data'