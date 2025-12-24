import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import render
from django.views.decorators.http import require_http_methods

from .forms import ReviewForm
from .models import PortfolioItem, Review


def home(request):
    portfolio_items = PortfolioItem.objects.all()
    # Prepare reviews as plain data for safe JSON serialization in template
    reviews_qs = Review.objects.all().values('name', 'title', 'text', 'created_at')
    reviews = [
        {
            'name': r['name'],
            'title': r['title'],
            'text': r['text'],
            'created_at': r['created_at'].isoformat(),
        }
        for r in reviews_qs
    ]
    return render(
        request,
        'home.html',
        {
            'portfolio_items': portfolio_items,
            'reviews': reviews,
        },
    )


@require_http_methods(['GET', 'POST'])
def reviews_api(request):
    if request.method == 'GET':
        reviews = Review.objects.all().values('name', 'title', 'text', 'created_at')
        # Convert datetime to isoformat for JSON serialization
        data = [
            {
                'name': r['name'],
                'title': r['title'],
                'text': r['text'],
                'created_at': r['created_at'].isoformat(),
            }
            for r in reviews
        ]
        return JsonResponse({'reviews': data})

    # POST
    try:
        payload = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return HttpResponseBadRequest('Invalid JSON')

    form = ReviewForm(payload)
    if form.is_valid():
        review = form.save()
        return JsonResponse(
            {
                'review': {
                    'name': review.name,
                    'title': review.title,
                    'text': review.text,
                    'created_at': review.created_at.isoformat(),
                }
            },
            status=201,
        )

    return JsonResponse({'errors': form.errors}, status=400)
