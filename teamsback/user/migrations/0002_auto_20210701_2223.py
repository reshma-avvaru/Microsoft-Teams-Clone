# Generated by Django 3.2.4 on 2021-07-01 16:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='token',
            old_name='id',
            new_name='identity',
        ),
        migrations.RemoveField(
            model_name='token',
            name='access_token',
        ),
    ]
