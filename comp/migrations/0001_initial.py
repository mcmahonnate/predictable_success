# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import comp.models


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CompensationSummary',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateField(null=True)),
                ('currency_type', models.CharField(blank=True, max_length=3, null=True, choices=[(b'USD', b'USD'), (b'AUD', b'AUD'), (b'GBP', b'GBP'), (b'CAD', b'CAD'), (b'EUR', b'EUR'), (b'SGP', b'SGP')])),
                ('year', models.IntegerField(default=comp.models.current_year, choices=[(1979, 1979), (1980, 1980), (1981, 1981), (1982, 1982), (1983, 1983), (1984, 1984), (1985, 1985), (1986, 1986), (1987, 1987), (1988, 1988), (1989, 1989), (1990, 1990), (1991, 1991), (1992, 1992), (1993, 1993), (1994, 1994), (1995, 1995), (1996, 1996), (1997, 1997), (1998, 1998), (1999, 1999), (2000, 2000), (2001, 2001), (2002, 2002), (2003, 2003), (2004, 2004), (2005, 2005), (2006, 2006), (2007, 2007), (2008, 2008), (2009, 2009), (2010, 2010), (2011, 2011), (2012, 2012), (2013, 2013), (2014, 2014), (2015, 2015), (2016, 2016)])),
                ('fiscal_year', models.IntegerField(default=comp.models.current_year, choices=[(1979, 1979), (1980, 1980), (1981, 1981), (1982, 1982), (1983, 1983), (1984, 1984), (1985, 1985), (1986, 1986), (1987, 1987), (1988, 1988), (1989, 1989), (1990, 1990), (1991, 1991), (1992, 1992), (1993, 1993), (1994, 1994), (1995, 1995), (1996, 1996), (1997, 1997), (1998, 1998), (1999, 1999), (2000, 2000), (2001, 2001), (2002, 2002), (2003, 2003), (2004, 2004), (2005, 2005), (2006, 2006), (2007, 2007), (2008, 2008), (2009, 2009), (2010, 2010), (2011, 2011), (2012, 2012), (2013, 2013), (2014, 2014), (2015, 2015), (2016, 2016)])),
                ('salary', models.DecimalField(default=0, max_digits=12, decimal_places=2)),
                ('bonus', models.DecimalField(default=0, max_digits=12, decimal_places=2)),
                ('discretionary', models.DecimalField(default=0, max_digits=12, decimal_places=2)),
                ('writer_payments_and_royalties', models.DecimalField(default=0, max_digits=12, decimal_places=2)),
                ('employee', models.ForeignKey(related_name='comp', to='org.Employee')),
            ],
            options={
                'permissions': (('view_compensationsummary', 'Can view compensation summary'),),
            },
            bases=(models.Model,),
        ),
    ]
