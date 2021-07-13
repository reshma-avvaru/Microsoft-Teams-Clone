# Generated by Django 3.2.4 on 2021-06-29 05:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='token',
            fields=[
                ('username', models.CharField(max_length=255)),
                ('id', models.CharField(default='None', max_length=256, primary_key=True, serialize=False)),
                ('access_token', models.CharField(default='None', max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.CharField(default='None', max_length=256, primary_key=True, serialize=False)),
                ('access_token', models.CharField(default='None', max_length=256)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='account', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
