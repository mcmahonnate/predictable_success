import re

def track_links(content, src=None,campaign=None):
    new_content = re.sub(r'\sAND\s', ' & ', content, flags=re.IGNORECASE)