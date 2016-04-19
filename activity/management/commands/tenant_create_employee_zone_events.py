from tenant_schemas.management.commands import BaseTenantCommand


class Command(BaseTenantCommand):
    COMMAND_NAME = 'create_employee_zone_events'