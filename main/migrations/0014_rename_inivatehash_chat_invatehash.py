# Generated by Django 4.0 on 2022-07-21 10:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_alter_chat_inivatehash'),
    ]

    operations = [
        migrations.RenameField(
            model_name='chat',
            old_name='inivateHash',
            new_name='invateHash',
        ),
    ]