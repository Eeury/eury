from django import forms

from .models import Review


class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['name', 'title', 'text']

    def clean_text(self):
        text = self.cleaned_data['text'].strip()
        if len(text) < 20:
            raise forms.ValidationError("Review must be at least 20 characters.")
        return text

    def clean_name(self):
        name = self.cleaned_data['name'].strip()
        if len(name) < 2:
            raise forms.ValidationError("Name is too short.")
        return name

    def clean_title(self):
        title = self.cleaned_data['title'].strip()
        if len(title) < 2:
            raise forms.ValidationError("Title is too short.")
        return title







