from tenant_schemas.management.commands import BaseTenantCommand


class Command(BaseTenantCommand):
    COMMAND_NAME = 'update_current_leader'
