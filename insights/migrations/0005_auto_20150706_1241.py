# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0004_auto_20150624_1443'),
    ]

    operations = [
        migrations.AlterField(
            model_name='prospect',
            name='talent_category',
            field=models.IntegerField(null=True, choices=[(6, b"I'm not sure what my future looks like or if I'm making an impact. I'm worried others also think this about me."), (5, b"I'm not as impactful as I could be. I feel like my strengths and responsibilities may be misaligned."), (4, b"I'm great at my job and my work is impactful now. However, thinking long term I'm not confident in the future impact of my role."), (3, b'I feel like I do a good job but the imapct of my work is not visibile to others.'), (2, b"Things are going well. I'm successful at my job, but I think Fools haven't seen my best work yet."), (1, b"I'm making a big impact, am appropriately challenged, and have the freedom and trust to grow my role in a way that excites me.")]),
            preserve_default=True,
        ),
    ]
