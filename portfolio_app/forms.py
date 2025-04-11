"""
Forms for the portfolio application.
"""
from django import forms
from django.utils.translation import gettext_lazy as _

from .utils import validate_email_address


class ContactForm(forms.Form):
    """Contact form for sending emails."""
    name = forms.CharField(
        label=_("Nombre"),
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': _('Tu Nombre')})
    )
    email = forms.EmailField(
        label=_("Email"),
        required=True,
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': _('Tu Email')})
    )
    subject = forms.CharField(
        label=_("Asunto"),
        max_length=200,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': _('Asunto')})
    )
    message = forms.CharField(
        label=_("Mensaje"),
        required=True,
        widget=forms.Textarea(attrs={'class': 'form-control', 'placeholder': _('Tu Mensaje'), 'rows': 5})
    )
    
    def clean_email(self):
        """Validate the email field."""
        email = self.cleaned_data.get('email')
        is_valid, msg = validate_email_address(email)
        
        if not is_valid:
            raise forms.ValidationError(_("Por favor introduce un email válido."))
        
        return email