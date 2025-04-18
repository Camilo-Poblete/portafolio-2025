# Generated by Django 5.2 on 2025-04-14 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio_app', '0002_technology_technologycategory_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='certificacion',
            name='archivo_pdf',
            field=models.FileField(blank=True, null=True, upload_to='static/media/images/', verbose_name='PDF del Certificado'),
        ),
        migrations.AlterField(
            model_name='certificacion',
            name='descripcion',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='certificacion',
            name='imagen',
            field=models.FileField(blank=True, null=True, upload_to='static/media/images/'),
        ),
    ]
