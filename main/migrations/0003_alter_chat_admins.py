# Generated by Django 4.0 on 2022-07-04 09:46

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0002_chat_admins'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='admins',
            field=models.ManyToManyField(blank=True, related_name='administrated_chats', to=settings.AUTH_USER_MODEL),
        ),
    ]